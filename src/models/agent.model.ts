import { v4 as uuid } from 'uuid';
import { pool } from '../config/database';

export interface Agent {
  id: string; name: string; description: string | null; icon: string | null;
  tenant_id: string | null;
  created_at: Date; updated_at: Date;
}
export interface CreateAgentDTO { name: string; description?: string; icon?: string; }
export interface UpdateAgentDTO { name?: string; description?: string; icon?: string; }

export const AgentModel = {
  async findAll(): Promise<Agent[]> {
    const { rows } = await pool.query('SELECT * FROM agents ORDER BY created_at ASC');
    return rows;
  },
  async findById(id: string): Promise<Agent | null> {
    const { rows } = await pool.query('SELECT * FROM agents WHERE id=$1', [id]);
    return rows[0] ?? null;
  },
  async create(dto: CreateAgentDTO & { tenant_id?: string }): Promise<Agent> {
    const { rows } = await pool.query(
      `INSERT INTO agents (id, name, description, icon, tenant_id) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [uuid(), dto.name.trim(), dto.description ?? null, dto.icon ?? null, dto.tenant_id ?? null],
    );
    return rows[0];
  },
  async update(id: string, dto: UpdateAgentDTO): Promise<Agent | null> {
    const fields: string[] = []; const vals: unknown[] = []; let n = 1;
    if (dto.name        !== undefined) { fields.push(`name=$${n++}`);        vals.push(dto.name); }
    if (dto.description !== undefined) { fields.push(`description=$${n++}`); vals.push(dto.description); }
    if (dto.icon        !== undefined) { fields.push(`icon=$${n++}`);        vals.push(dto.icon); }
    if (!fields.length) return null;
    fields.push('updated_at=NOW()');
    vals.push(id);
    const { rows } = await pool.query(
      `UPDATE agents SET ${fields.join(',')} WHERE id=$${n} RETURNING *`, vals,
    );
    return rows[0] ?? null;
  },
  async delete(id: string): Promise<boolean> {
    const { rowCount } = await pool.query('DELETE FROM agents WHERE id=$1', [id]);
    return (rowCount ?? 0) > 0;
  },
};
