require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const usersRouter    = require('./routes/users');
const chatRouter     = require('./routes/chat');
const whatsappRouter = require('./routes/whatsapp');
const agentsRouter   = require('./routes/agents');

const chatRepo   = require('./repositories/chatRepository');
const agentRepo  = require('./repositories/agentRepository');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/users',    usersRouter);
app.use('/api/chat',     chatRouter);
app.use('/api/whatsapp', whatsappRouter);
app.use('/api/agents',   agentsRouter);

// Error handler
app.use((err, _req, res, _next) => {
  res.status(err.status ?? 500).json({ error: err.message ?? 'Internal server error' });
});

Promise.all([
  chatRepo.init(),
  agentRepo.init(),
]).catch(console.error);

app.listen(4000, () => console.log('API running on http://localhost:4000'));
