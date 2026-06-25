CREATE TABLE IF NOT EXISTS users (
  id               TEXT PRIMARY KEY,
  name             TEXT NOT NULL,
  email            TEXT NOT NULL,
  bot_id           TEXT,
  device_ids       TEXT[] NOT NULL DEFAULT '{}',
  telemetry_status TEXT NOT NULL
);
