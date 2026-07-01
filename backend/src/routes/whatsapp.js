const express = require('express');
const { MessagingResponse } = require('twilio').twiml;
const chatService = require('../services/chatService');
const chatRepo    = require('../repositories/chatRepository');

const router = express.Router();

// Twilio POSTs application/x-www-form-urlencoded
router.use(express.urlencoded({ extended: false }));

router.post('/', async (req, res) => {
  const incomingMessage = req.body.Body?.trim();
  const phone           = (req.body.From || '').replace('whatsapp:', '');
  const name            = req.body.ProfileName || phone;

  if (!incomingMessage) return res.status(400).send('Missing Body');

  let botResponse;
  try {
    // Find or create chat session
    const { rows } = await chatRepo.findByPhone(phone);
    const session  = rows.length
      ? rows[0]
      : (await chatRepo.createSession({ name, phone })).rows[0];

    // Look up which ThingsBoard device is linked to this phone number
    const { rows: mapping } = await chatRepo.findDeviceByPhone(phone);
    const deviceId   = mapping[0]?.device_id   ?? null;
    const deviceName = mapping[0]?.device_name ?? null;

    if (!deviceId) {
      botResponse = `Your phone number (${phone}) is not linked to any device yet. Please contact your administrator to link your device.`;
    } else {
      const { reply } = await chatService.chat({
        sessionId: session.id,
        message: incomingMessage,
        deviceId,
        deviceName,
      });
      botResponse = reply;
    }

  } catch (err) {
    console.error('[WhatsApp]', err.message);
    botResponse = 'Sorry, something went wrong. Please try again.';
  }

  const twiml = new MessagingResponse();
  twiml.message(botResponse);
  res.type('text/xml').send(twiml.toString());
});

module.exports = router;
