const db = require('../config/db');

const findAll = () =>
  db.query('SELECT * FROM users ORDER BY name');

const create = ({ id, name, email, botId, deviceIds, telemetryStatus }) =>
  db.query(
    `INSERT INTO users (id, name, email, bot_id, device_ids, telemetry_status)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [id, name, email, botId ?? null, deviceIds ?? [], telemetryStatus]
  );

const update = ({ name, email, botId, deviceIds, telemetryStatus }, id) =>
  db.query(
    `UPDATE users
     SET name = $1, email = $2, bot_id = $3, device_ids = $4, telemetry_status = $5
     WHERE id = $6 RETURNING *`,
    [name, email, botId ?? null, deviceIds ?? [], telemetryStatus, id]
  );

const remove = (id) =>
  db.query('DELETE FROM users WHERE id = $1', [id]);

module.exports = { findAll, create, update, remove };
