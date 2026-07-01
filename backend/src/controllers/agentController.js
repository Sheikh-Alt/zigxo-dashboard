const svc = require('../services/agentService');

const list = async (req, res, next) => {
  try { res.json(await svc.listAgents()); }
  catch (e) { next(e); }
};

const create = async (req, res, next) => {
  try { res.status(201).json(await svc.createAgent(req.body)); }
  catch (e) { next(e); }
};

const update = async (req, res, next) => {
  try { res.json(await svc.updateAgent(req.params.id, req.body)); }
  catch (e) { next(e); }
};

const remove = async (req, res, next) => {
  try { await svc.deleteAgent(req.params.id); res.status(204).end(); }
  catch (e) { next(e); }
};

const uploadFile = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file provided' });
    res.status(201).json(await svc.uploadFile(req.params.id, req.file));
  } catch (e) { next(e); }
};

const listFiles = async (req, res, next) => {
  try { res.json(await svc.listFiles(req.params.id)); }
  catch (e) { next(e); }
};

const deleteFile = async (req, res, next) => {
  try { await svc.removeFile(req.params.fileId); res.status(204).end(); }
  catch (e) { next(e); }
};

module.exports = { list, create, update, remove, uploadFile, listFiles, deleteFile };
