const express    = require('express');
const controller = require('../controllers/chatController');
const chatRepo   = require('../repositories/chatRepository');

const router = express.Router();

router.post('/register', controller.register);
router.post('/message',  controller.message);

// Admin: link a phone number to a ThingsBoard device
// POST /api/chat/link-device  { phone, device_id, device_name }
router.post('/link-device', async (req, res, next) => {
  try {
    const { phone, device_id, device_name } = req.body ?? {};
    if (!phone?.trim() || !device_id?.trim())
      return res.status(400).json({ error: 'phone and device_id are required' });
    await chatRepo.linkPhoneToDevice({ phone: phone.trim(), device_id: device_id.trim(), device_name: device_name?.trim() });
    res.json({ message: `Phone ${phone} linked to device ${device_name ?? device_id}` });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
