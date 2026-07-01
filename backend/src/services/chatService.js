const repo      = require('../repositories/chatRepository');
const agentRepo = require('../repositories/agentRepository');
const tb        = require('./thingsBoardService');

const fmt = (v, decimals = 1) => {
  const n = Number(v);
  if (isNaN(n)) return v;
  return Number.isInteger(n) ? n : parseFloat(n.toFixed(decimals));
};

const history     = new Map();
const MAX_HISTORY = 6;   // keep context short to save tokens

let groq = null;
if (process.env.GROQ_API_KEY) {
  const Groq = require('groq-sdk');
  groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// ── Pre-fetch live data from ThingsBoard ──────────────────────────────────────

async function fetchLiveData(userDevice, userMessage) {
  const lower  = userMessage.toLowerCase();
  const result = {};

  // Always fetch telemetry for the user's device
  try {
    let deviceId = userDevice.device_id;

    // Resolve name → UUID if needed
    if (!UUID_RE.test(deviceId)) {
      const devices = await tb.getDevices();
      const match   = devices.find(d => d.name === deviceId || d.name === userDevice.device_name);
      if (match) deviceId = match.id.id;
    }

    const tel      = await tb.getLatestTelemetry(deviceId);
    const readings = {};
    for (const [key, values] of Object.entries(tel)) {
      if (values?.[0]?.value != null) readings[key] = fmt(values[0].value, 1);
    }
    result.telemetry     = readings;
    result.resolvedId    = deviceId;
    console.log(`[ChatService] telemetry keys: ${Object.keys(readings).join(', ')}`);
  } catch (e) {
    result.telemetryError = e.message;
    console.error('[ChatService] telemetry fetch error:', e.message);
  }

  // Fetch alarms only when relevant
  if (['alarm', 'alert', 'warning', 'issue'].some(k => lower.includes(k))) {
    try {
      const alarms = await tb.getActiveAlarms();
      result.alarms = alarms.map(a => ({
        type:     a.type,
        device:   a.originatorName ?? 'unknown',
        severity: a.severity,
      }));
    } catch (e) {
      result.alarmsError = e.message;
    }
  }

  // Fetch device list only when asked
  if (['device', 'online', 'offline', 'list', 'all'].some(k => lower.includes(k))) {
    try {
      const devices    = await tb.getDevices();
      result.devices   = devices.map(d => ({ name: d.name, status: d.active ? 'online' : 'offline' }));
    } catch (e) {
      result.devicesError = e.message;
    }
  }

  return result;
}

// ── Build system prompt with injected live data ───────────────────────────────

async function buildSystemPrompt(userDevice, liveData) {
  // Device section
  const deviceSection = `\n\nLinked device: "${userDevice.device_name}" (ID: ${userDevice.device_id}).
Never ask which device — always use this one. Only ask for clarification when the sensor type is ambiguous (e.g. "indoor or outdoor?").`;

  // Live data section — compact format to save tokens
  let dataSection = '';
  if (liveData.telemetry && Object.keys(liveData.telemetry).length > 0) {
    const flat = Object.entries(liveData.telemetry).map(([k, v]) => `${k}:${v}`).join(', ');
    dataSection = `\n\nLive data (${userDevice.device_name}): ${flat}`;
  } else if (liveData.telemetryError) {
    dataSection = `\n\n[Sensor fetch failed: ${liveData.telemetryError}]`;
  }

  if (liveData.alarms !== undefined) {
    dataSection += `\nAlarms: ${liveData.alarms.length ? liveData.alarms.map(a => `${a.type}(${a.severity})`).join(', ') : 'none'}`;
  }
  if (liveData.devices !== undefined) {
    dataSection += `\nDevices: ${liveData.devices.map(d => `${d.name}=${d.status}`).join(', ')}`;
  }

  // Custom agent instructions (no raw PDF text — just the system_prompt field)
  let customInstructions = '';
  try {
    const { rows } = await agentRepo.getAllDocumentContext();
    const override  = rows.find(r => r.system_prompt)?.system_prompt;
    if (override) customInstructions = `\n\n${override}`;
  } catch (_) {}

  return `You are an IoT assistant for City Greens greenhouse sensors (Zigxo/ThingsBoard). Answer from the live data below only. Be brief.
Keys: temp_in=indoor temp, temp_out=outdoor temp, rh_in=indoor humidity, rh_out=outdoor humidity, co2_in=CO2 ppm, ec_nt1/ec_nt2=nutrient EC, ph_nt1/ph_nt2=nutrient pH, vpd=VPD, bat=battery%, _EPD_Humi=external humidity probe. If a key is missing say "not available".${deviceSection}${dataSection}${customInstructions}`;
}

// ── UUID resolver (updates DB with real UUID) ─────────────────────────────────

async function resolveDeviceUUID(phone, deviceId, deviceName) {
  if (UUID_RE.test(deviceId)) return { device_id: deviceId, device_name: deviceName };
  try {
    const devices = await tb.getDevices();
    const match   = devices.find(d => d.name === deviceId || d.name === deviceName);
    if (match) {
      const resolved = { device_id: match.id.id, device_name: match.name };
      await repo.linkPhoneToDevice({ phone, ...resolved });
      return resolved;
    }
  } catch (e) {
    console.error('[ChatService] UUID resolve error:', e.message);
  }
  return { device_id: deviceId, device_name: deviceName };
}

// ── Public API ─────────────────────────────────────────────────────────────────

async function register({ name, phone }) {
  const { rows } = await repo.createSession({ name, phone });
  return rows[0];
}

async function chat({ sessionId, message }) {
  const { rows } = await repo.findSession(sessionId);
  if (!rows.length) {
    const err = new Error('Session not found');
    err.status = 404;
    throw err;
  }

  const phone = rows[0].phone;

  // Auth gate
  const { rows: mapping } = await repo.findDeviceByPhone(phone);
  if (!mapping.length) {
    return { reply: `Your number (${phone}) is not registered to any device. Please contact the administrator.` };
  }

  // Resolve UUID if stored as device name
  const userDevice = await resolveDeviceUUID(phone, mapping[0].device_id, mapping[0].device_name);

  // ── Groq path (no tool use — data injected into prompt) ───────────────────
  if (groq) {
    const prior = history.get(sessionId) ?? [];
    try {
      const liveData     = await fetchLiveData(userDevice, message);
      const systemPrompt = await buildSystemPrompt(userDevice, liveData);

      const messages = [
        { role: 'system', content: systemPrompt },
        ...prior,
        { role: 'user', content: message },
      ];

      const response = await groq.chat.completions.create({
        model:      'llama-3.1-8b-instant',  // 500K TPD vs 100K for 70b
        messages,
        max_tokens: 256,
      });

      const reply   = response.choices[0].message.content ?? 'Sorry, I could not generate a response.';
      const updated = [...prior, { role: 'user', content: message }, { role: 'assistant', content: reply }];
      history.set(sessionId, updated.slice(-MAX_HISTORY));
      return { reply };
    } catch (err) {
      console.error('[ChatService] Groq error:', err.message);
      return { reply: `⚠️ Groq error: ${err.message}` };
    }
  }

  // ── Keyword fallback (no API key) ─────────────────────────────────────────
  const lower = message.toLowerCase();
  try {
    if (['online', 'status', 'active', 'device'].some(k => lower.includes(k))) {
      const devices = await tb.getDevices();
      const on  = devices.filter(d => d.active);
      const off = devices.filter(d => !d.active);
      return { reply: `Online (${on.length}): ${on.map(d => d.name).join(', ') || 'none'}. Offline (${off.length}): ${off.map(d => d.name).join(', ') || 'none'}.` };
    }
    const tel      = await tb.getLatestTelemetry(userDevice.device_id);
    const readings = Object.entries(tel)
      .filter(([, v]) => v?.[0]?.value != null)
      .map(([k, v]) => `${k}: ${fmt(v[0].value)}`)
      .join(', ');
    return { reply: readings ? `Latest from ${userDevice.device_name} — ${readings}.` : `No telemetry available for ${userDevice.device_name}.` };
  } catch (e) {
    console.error('[ChatService] Fallback error:', e.message);
  }

  return { reply: 'Add a GROQ_API_KEY to .env to enable full AI responses.' };
}

module.exports = { register, chat };
