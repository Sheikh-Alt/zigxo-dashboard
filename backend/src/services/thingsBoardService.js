const axios = require('axios');

const TB_URL      = process.env.TB_URL;
const TB_USERNAME = process.env.TB_USERNAME;
const TB_PASSWORD = process.env.TB_PASSWORD;

let cachedToken   = null;
let tokenExpiryMs = 0;

function jwtExpiryMs(token) {
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString());
    return payload.exp * 1000;
  } catch {
    return Date.now() + 9_000_000;
  }
}

async function authenticate() {
  const { data } = await axios.post(`${TB_URL}/api/auth/login`, {
    username: TB_USERNAME,
    password: TB_PASSWORD,
  });
  cachedToken   = data.token;
  tokenExpiryMs = jwtExpiryMs(cachedToken);
}

async function getToken() {
  if (!cachedToken || Date.now() >= tokenExpiryMs - 60_000) {
    await authenticate();
  }
  return cachedToken;
}

function authHeader(token) {
  return { 'X-Authorization': `Bearer ${token}` };
}

// Returns all tenant devices with their active/inactive status
async function getDevices() {
  const token = await getToken();
  const { data } = await axios.get(
    `${TB_URL}/api/tenant/devices?pageSize=100&page=0&sortProperty=name&sortOrder=ASC`,
    { headers: authHeader(token) }
  );
  return data.data ?? [];
}

// Returns latest telemetry values for a device (all keys)
async function getLatestTelemetry(deviceId) {
  const token = await getToken();
  const { data } = await axios.get(
    `${TB_URL}/api/plugins/telemetry/DEVICE/${deviceId}/values/timeseries`,
    { headers: authHeader(token) }
  );
  return data;
}

// Returns active unacknowledged alarms for the tenant
async function getActiveAlarms() {
  const token = await getToken();
  const { data } = await axios.get(
    `${TB_URL}/api/alarms?searchStatus=ACTIVE_UNACK&pageSize=10&page=0&sortProperty=createdTime&sortOrder=DESC`,
    { headers: authHeader(token) }
  );
  return data.data ?? [];
}

module.exports = { getDevices, getLatestTelemetry, getActiveAlarms };
