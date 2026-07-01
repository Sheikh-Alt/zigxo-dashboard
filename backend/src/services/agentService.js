const repo = require('../repositories/agentRepository');

// ── Text extraction ──────────────────────────────────────────────────────────

async function extractText(buffer, mimetype, originalName) {
  const ext = (originalName || '').split('.').pop()?.toLowerCase();

  if (mimetype === 'application/pdf' || ext === 'pdf') {
    // Lazy-require to avoid pdf-parse loading its test file at import time
    const pdfParse = require('pdf-parse');
    const data = await pdfParse(buffer);
    return data.text;
  }

  // Plain-text formats: txt, csv, json, html, md
  return buffer.toString('utf-8');
}

// ── Agent CRUD ───────────────────────────────────────────────────────────────

const listAgents = async () => {
  const { rows } = await repo.getAllAgents();
  return rows;
};

const createAgent = async ({ name, description, system_prompt, conversation_starters }) => {
  const { rows } = await repo.createAgent({ name, description, system_prompt, conversation_starters });
  return rows[0];
};

const updateAgent = async (id, data) => {
  const { rows } = await repo.updateAgent(id, data);
  if (!rows.length) {
    const e = new Error('Agent not found');
    e.status = 404;
    throw e;
  }
  return rows[0];
};

const deleteAgent = async (id) => {
  await repo.deleteAgent(id);
};

// ── File operations ──────────────────────────────────────────────────────────

const uploadFile = async (agentId, file) => {
  const { rows: agent } = await repo.getAgentById(agentId);
  if (!agent.length) {
    const e = new Error('Agent not found');
    e.status = 404;
    throw e;
  }

  let content_text = null;
  try {
    content_text = await extractText(file.buffer, file.mimetype, file.originalname);
  } catch (err) {
    console.warn('[AgentService] Text extraction failed:', err.message);
    // Store file without text — it just won't be searchable
  }

  const { rows } = await repo.createFile({
    agent_id: agentId,
    original_name: file.originalname,
    mimetype: file.mimetype,
    size_bytes: file.size,
    content_text,
    file_data: file.buffer,
  });
  return rows[0];
};

const listFiles = async (agentId) => {
  const { rows } = await repo.getFilesByAgent(agentId);
  return rows;
};

const removeFile = async (fileId) => {
  await repo.deleteFile(fileId);
};

module.exports = { listAgents, createAgent, updateAgent, deleteAgent, uploadFile, listFiles, removeFile };
