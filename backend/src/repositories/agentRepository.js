const db = require('../config/db');

const init = async () => {
  await db.query(`
    CREATE TABLE IF NOT EXISTS agents (
      id                    SERIAL PRIMARY KEY,
      name                  VARCHAR(255) NOT NULL,
      description           TEXT DEFAULT '',
      system_prompt         TEXT DEFAULT '',
      conversation_starters JSONB DEFAULT '[]'::jsonb,
      created_at            TIMESTAMPTZ DEFAULT now(),
      updated_at            TIMESTAMPTZ DEFAULT now()
    )
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS agent_files (
      id            SERIAL PRIMARY KEY,
      agent_id      INTEGER NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
      original_name VARCHAR(500) NOT NULL,
      mimetype      VARCHAR(100),
      size_bytes    INTEGER,
      content_text  TEXT,
      file_data     BYTEA,
      created_at    TIMESTAMPTZ DEFAULT now()
    )
  `);
};

// ── Agents ──────────────────────────────────────────────────────────────────

const createAgent = ({ name, description = '', system_prompt = '', conversation_starters = [] }) =>
  db.query(
    `INSERT INTO agents (name, description, system_prompt, conversation_starters)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, description, system_prompt, conversation_starters, created_at`,
    [name, description, system_prompt, JSON.stringify(conversation_starters)]
  );

const getAllAgents = () =>
  db.query(
    'SELECT id, name, description, system_prompt, conversation_starters, created_at FROM agents ORDER BY created_at ASC'
  );

const getAgentById = (id) =>
  db.query('SELECT * FROM agents WHERE id = $1', [id]);

const updateAgent = (id, { name, description, system_prompt, conversation_starters }) =>
  db.query(
    `UPDATE agents
     SET name                  = COALESCE($1, name),
         description           = COALESCE($2, description),
         system_prompt         = COALESCE($3, system_prompt),
         conversation_starters = COALESCE($4, conversation_starters),
         updated_at            = now()
     WHERE id = $5
     RETURNING id, name, description, system_prompt, conversation_starters`,
    [
      name ?? null,
      description ?? null,
      system_prompt ?? null,
      conversation_starters != null ? JSON.stringify(conversation_starters) : null,
      id,
    ]
  );

const deleteAgent = (id) =>
  db.query('DELETE FROM agents WHERE id = $1', [id]);

// ── Agent files ──────────────────────────────────────────────────────────────

const createFile = ({ agent_id, original_name, mimetype, size_bytes, content_text, file_data }) =>
  db.query(
    `INSERT INTO agent_files (agent_id, original_name, mimetype, size_bytes, content_text, file_data)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id, agent_id, original_name, mimetype, size_bytes, created_at`,
    [agent_id, original_name, mimetype, size_bytes, content_text, file_data]
  );

const getFilesByAgent = (agent_id) =>
  db.query(
    `SELECT id, agent_id, original_name, mimetype, size_bytes, created_at
     FROM agent_files WHERE agent_id = $1 ORDER BY created_at ASC`,
    [agent_id]
  );

const deleteFile = (id) =>
  db.query('DELETE FROM agent_files WHERE id = $1', [id]);

// Returns all file content across all agents — used to build Claude context
const getAllDocumentContext = () =>
  db.query(
    `SELECT af.content_text, af.original_name, a.name AS agent_name, a.system_prompt
     FROM agent_files af
     JOIN agents a ON a.id = af.agent_id
     WHERE af.content_text IS NOT NULL
     ORDER BY a.id ASC, af.created_at ASC`
  );

module.exports = {
  init,
  createAgent, getAllAgents, getAgentById, updateAgent, deleteAgent,
  createFile, getFilesByAgent, deleteFile,
  getAllDocumentContext,
};
