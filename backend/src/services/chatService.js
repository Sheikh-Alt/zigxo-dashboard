const repo = require('../repositories/chatRepository');
const tb   = require('./thingsBoardService');

async function getBotReply(message, deviceId = null, deviceName = null) {
  const lower = message.toLowerCase();

  try {

    // --- Device status / online ---
    if (['online', 'status', 'active'].some(k => lower.includes(k))) {
      const devices = await tb.getDevices();
      const online  = devices.filter(d => d.active);
      const offline = devices.filter(d => !d.active);
      return `Online (${online.length}): ${online.map(d => d.name).join(', ') || 'none'}. ` +
             `Offline (${offline.length}): ${offline.map(d => d.name).join(', ') || 'none'}.`;
    }

    // --- Offline / down devices ---
    if (['offline', 'down', 'issue', 'problem', 'error'].some(k => lower.includes(k))) {
      const devices = await tb.getDevices();
      const offline = devices.filter(d => !d.active);
      if (!offline.length) return 'All devices are currently online.';
      return `Offline device(s): ${offline.map(d => d.name).join(', ')}.`;
    }

    // --- Telemetry / temperature / humidity / CO2 ---
    if (['telemetry', 'temperature', 'humidity', 'co2', 'data', 'reading'].some(k => lower.includes(k))) {
      let id   = deviceId;
      let name = deviceName;

      // If no device mapped to this phone, fall back to first device in ThingsBoard
      if (!id) {
        const devices = await tb.getDevices();
        if (!devices.length) return 'No devices found in ThingsBoard.';
        id   = devices[0].id.id;
        name = devices[0].name;
      }

      const tel  = await tb.getLatestTelemetry(id);
      const temp = tel.Temperature?.[0]?.value ?? 'N/A';
      const hum  = tel.Humidity?.[0]?.value    ?? 'N/A';
      const co2  = tel.CO2?.[0]?.value         ?? 'N/A';
      return `Latest telemetry from ${name} — Temperature: ${temp}°C, Humidity: ${hum}%, CO2: ${co2} ppm.`;
    }

    // --- Alerts / alarms ---
    if (['alert', 'alarm', 'warning', 'critical'].some(k => lower.includes(k))) {
      const alarms = await tb.getActiveAlarms();
      if (!alarms.length) return 'No active alarms at this time. All thresholds are within normal range.';
      const list = alarms.map(a => `${a.type} on ${a.originatorName ?? 'unknown'}`).join('; ');
      return `Active alarm(s) (${alarms.length}): ${list}.`;
    }

    // --- Device count ---
    if (['device', 'devices', 'count', 'how many', 'registered'].some(k => lower.includes(k))) {
      const devices = await tb.getDevices();
      const online  = devices.filter(d => d.active).length;
      return `You have ${devices.length} registered device(s) — ${online} online, ${devices.length - online} offline.`;
    }

    // --- Reboot / restart ---
    if (['reboot', 'restart', 'reconnect', 'reset'].some(k => lower.includes(k))) {
      return 'To reboot a device, use the ThingsBoard RPC feature or contact your administrator.';
    }

    // --- Battery ---
    if (['battery', 'power', 'charge'].some(k => lower.includes(k))) {
      const devices = await tb.getDevices();
      if (!devices.length) return 'No devices found.';
      const results = await Promise.all(
        devices.slice(0, 5).map(async d => {
          const tel = await tb.getLatestTelemetry(d.id.id, 'Battery,battery,BatteryLevel');
          const bat = tel.Battery?.[0]?.value ?? tel.battery?.[0]?.value ?? tel.BatteryLevel?.[0]?.value ?? 'N/A';
          return `${d.name}: ${bat}`;
        })
      );
      return `Battery levels — ${results.join(', ')}.`;
    }

    // --- Help ---
    if (['help', 'what can', 'commands', 'support'].some(k => lower.includes(k))) {
      return 'I can help you with: device status, offline devices, temperature, humidity, CO2, alerts, device count, battery. Just ask!';
    }

  } catch (err) {
    console.error('[ChatService] ThingsBoard error:', err.message);
    return 'Could not fetch live data from ThingsBoard right now. Please try again shortly.';
  }

  return "I'm not sure about that. Try asking about: status, temperature, co2, alerts, battery, or type 'help'.";
}

async function register({ name, phone }) {
  const { rows } = await repo.createSession({ name, phone });
  return rows[0];
}

async function chat({ sessionId, message, deviceId = null, deviceName = null }) {
  const { rows } = await repo.findSession(sessionId);
  if (!rows.length) {
    const err = new Error('Session not found');
    err.status = 404;
    throw err;
  }

  // If deviceId not passed directly, look it up from the session's phone number
  let resolvedId   = deviceId;
  let resolvedName = deviceName;

  if (!resolvedId) {
    const { rows: mapping } = await repo.findDeviceByPhone(rows[0].phone);
    resolvedId   = mapping[0]?.device_id   ?? null;
    resolvedName = mapping[0]?.device_name ?? null;
  }

  return { reply: await getBotReply(message, resolvedId, resolvedName) };
}

module.exports = { register, chat };
