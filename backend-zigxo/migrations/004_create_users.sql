CREATE TABLE IF NOT EXISTS users (
  id         TEXT   PRIMARY KEY,
  name       TEXT   NOT NULL,
  email      TEXT   NOT NULL UNIQUE,
  bot_id     TEXT,
  device_ids TEXT[] NOT NULL DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_users_bot_id ON users (bot_id);
CREATE INDEX IF NOT EXISTS idx_users_email  ON users (email);
