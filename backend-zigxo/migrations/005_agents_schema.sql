-- Note: pgvector not required — embedding stored as JSONB array.
-- When pgvector is installed later, ALTER TABLE chunks ALTER COLUMN embedding TYPE vector(1536) USING embedding::text::vector;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Topics ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS topics (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT NOT NULL,
  description TEXT,
  icon        TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Data sources (files / URLs / pasted text) ─────────────────────────────────
CREATE TABLE IF NOT EXISTS data_sources (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id    UUID NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  type        TEXT NOT NULL CHECK (type IN ('file','url','text')),
  mime_type   TEXT,
  size_bytes  BIGINT,
  local_key   TEXT,
  gcs_key     TEXT,
  source_url  TEXT,
  status      TEXT NOT NULL DEFAULT 'pending'
                CHECK (status IN ('pending','processing','ready','error')),
  chunk_count INTEGER NOT NULL DEFAULT 0,
  token_count INTEGER NOT NULL DEFAULT 0,
  error_msg   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Chunks + embeddings (JSONB until pgvector is installed) ───────────────────
CREATE TABLE IF NOT EXISTS chunks (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_id   UUID NOT NULL REFERENCES data_sources(id) ON DELETE CASCADE,
  topic_id    UUID NOT NULL REFERENCES topics(id)       ON DELETE CASCADE,
  chunk_index INTEGER NOT NULL,
  content     TEXT NOT NULL,
  embedding   JSONB,
  metadata    JSONB NOT NULL DEFAULT '{}',
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chunks_source_id ON chunks (source_id);
CREATE INDEX IF NOT EXISTS idx_chunks_topic_id  ON chunks (topic_id);

-- ── Instruction sets (one per topic) ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS instruction_sets (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id      UUID UNIQUE NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  system_prompt TEXT NOT NULL DEFAULT '',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Conversation starters ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS conversation_starters (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instruction_id UUID NOT NULL REFERENCES instruction_sets(id) ON DELETE CASCADE,
  text           TEXT NOT NULL,
  sort_order     INTEGER NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Reference files (PDF/DOCX/ZIP/CSV/JSON/TAR only) ─────────────────────────
CREATE TABLE IF NOT EXISTS reference_files (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  instruction_id UUID NOT NULL REFERENCES instruction_sets(id) ON DELETE CASCADE,
  name           TEXT NOT NULL,
  type           TEXT NOT NULL CHECK (type IN ('file','url')),
  mime_type      TEXT,
  size_bytes     BIGINT,
  local_key      TEXT,
  gcs_key        TEXT,
  source_url     TEXT,
  status         TEXT NOT NULL DEFAULT 'pending'
                   CHECK (status IN ('pending','processing','ready','error')),
  error_msg      TEXT,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Job tracking ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS upload_jobs (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_id    UUID REFERENCES data_sources(id)    ON DELETE SET NULL,
  ref_file_id  UUID REFERENCES reference_files(id) ON DELETE SET NULL,
  queue_job_id TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'pending',
  progress     INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  finished_at  TIMESTAMPTZ
);
