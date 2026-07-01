const service = require('../services/chatService');

const register = async (req, res, next) => {
  try {
    const { name, phone } = req.body ?? {};
    if (!name?.trim() || !phone?.trim())
      return res.status(400).json({ error: 'name and phone are required' });
    const session = await service.register({ name: name.trim(), phone: phone.trim() });
    res.status(201).json(session);
  } catch (err) {
    next(err);
  }
};

const message = async (req, res, next) => {
  try {
    const { sessionId, message: msg } = req.body ?? {};
    if (!sessionId || !msg?.trim())
      return res.status(400).json({ error: 'sessionId and message are required' });
    const result = await service.chat({ sessionId, message: msg.trim() });
    res.json(result);
  } catch (err) {
    next(err);
  }
};

module.exports = { register, message };
