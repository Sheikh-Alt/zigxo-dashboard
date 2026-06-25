const repo = require('../repositories/usersRepository');

const toClient = (row) => ({
  id: row.id,
  name: row.name,
  email: row.email,
  botId: row.bot_id,
  deviceIds: row.device_ids,
  telemetryStatus: row.telemetry_status,
});

const getAll = async () => {
  const { rows } = await repo.findAll();
  return rows.map(toClient);
};

const create = async (data) => {
  const { rows } = await repo.create(data);
  return toClient(rows[0]);
};

const update = async (id, data) => {
  const { rows } = await repo.update(data, id);
  if (rows.length === 0) return null;
  return toClient(rows[0]);
};

const remove = async (id) => {
  const { rowCount } = await repo.remove(id);
  return rowCount > 0;
};

module.exports = { getAll, create, update, remove };
