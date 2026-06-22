const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// DB columns are snake_case; the frontend uses camelCase. Map between them.
const toClient = (row) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  botId: row.bot_id,
  deviceIds: row.device_ids,
  telemetryStatus: row.telemetry_status,
});

// GET all users
app.get('/api/users', async (_req, res) => {
  try {
    const { rows } = await db.query('SELECT * FROM users ORDER BY name');
    res.json(rows.map(toClient));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load users' });
  }
});

// CREATE a user
app.post('/api/users', async (req, res) => {
  try {
    const { id, name, email, botId, deviceIds, telemetryStatus } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'name and email are required' });

    const { rows } = await db.query(
      `INSERT INTO users (id, name, email, bot_id, device_ids, telemetry_status)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [id, name, email, botId ?? null, deviceIds ?? [], telemetryStatus]
    );
    res.status(201).json(toClient(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save user' });
  }
});

// UPDATE a user
app.put('/api/users/:id', async (req, res) => {
  try {
    const { name, email, botId, deviceIds, telemetryStatus } = req.body;
    const { rows } = await db.query(
      `UPDATE users
       SET name = $1, email = $2, bot_id = $3, device_ids = $4, telemetry_status = $5
       WHERE id = $6
       RETURNING *`,
      [name, email, botId ?? null, deviceIds ?? [], telemetryStatus, req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json(toClient(rows[0]));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// DELETE a user
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { rowCount } = await db.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    if (rowCount === 0) return res.status(404).json({ error: 'User not found' });
    res.status(204).end();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

app.listen(4000, () => console.log('API running on http://localhost:4000'));
