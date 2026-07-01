const db = require('../config/db');

const init = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS chat_sessions (
      id         SERIAL PRIMARY KEY,
      name       TEXT NOT NULL,
      phone      TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now()
    )
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS phone_device_map (
      phone       TEXT PRIMARY KEY,
      device_id   TEXT NOT NULL,
      device_name TEXT
    )
  `);
};

const createSession = ({ name, phone }) =>
  db.query(
    'INSERT INTO chat_sessions (name, phone) VALUES ($1, $2) RETURNING id, name, phone, created_at',
    [name, phone]
  );

const findSession = (id) =>
  db.query('SELECT * FROM chat_sessions WHERE id = $1', [id]);

const findByPhone = (phone) =>
  db.query('SELECT * FROM chat_sessions WHERE phone = $1 LIMIT 1', [phone]);

// Returns the device mapped to a phone number
const findDeviceByPhone = (phone) =>
  db.query('SELECT * FROM phone_device_map WHERE phone = $1', [phone]);

// Links a phone number to a ThingsBoard device (upsert)
const linkPhoneToDevice = ({ phone, device_id, device_name }) =>
  db.query(
    `INSERT INTO phone_device_map (phone, device_id, device_name)
     VALUES ($1, $2, $3)
     ON CONFLICT (phone) DO UPDATE SET device_id = $2, device_name = $3`,
    [phone, device_id, device_name]
  );

module.exports = { init, createSession, findSession, findByPhone, findDeviceByPhone, linkPhoneToDevice };
