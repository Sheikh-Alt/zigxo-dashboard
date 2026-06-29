const service = require('../services/usersService');

const getAll = async (_req, res) => {
  try {
    res.json(await service.getAll());
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load users' });
  }
};

const create = async (req, res) => {
  try {
    const { id, name, email, botId, deviceIds, telemetryStatus } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'name and email are required' });
    res.status(201).json(await service.create({ id, name, email, botId, deviceIds, telemetryStatus }));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save user' });
  }
};

const update = async (req, res) => {
  try {
    const user = await service.update(req.params.id, req.body);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update user' });
  }
};

const remove = async (req, res) => {
  try {
    const deleted = await service.remove(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'User not found' });
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

module.exports = { getAll, create, update, remove };
