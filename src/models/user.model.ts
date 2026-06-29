import { v4 as uuidv4 } from 'uuid';
import { pool } from '../config/database';
import { User, CreateUserDTO, UpdateUserDTO } from '../types';

export const UserModel = {
  async findAll(): Promise<User[]> {
    const result = await pool.query<User>(
      'SELECT * FROM users ORDER BY id ASC',
    );
    return result.rows;
  },

  async findById(id: string): Promise<User | null> {
    const result = await pool.query<User>(
      'SELECT * FROM users WHERE id = $1',
      [id],
    );
    return result.rows[0] ?? null;
  },

  async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query<User>(
      'SELECT * FROM users WHERE email = $1',
      [email],
    );
    return result.rows[0] ?? null;
  },

  async findByBotId(botId: string): Promise<User[]> {
    const result = await pool.query<User>(
      'SELECT * FROM users WHERE bot_id = $1',
      [botId],
    );
    return result.rows;
  },

  async create(dto: CreateUserDTO): Promise<User> {
    const result = await pool.query<User>(
      `INSERT INTO users (id, name, email, bot_id, device_ids)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        dto.id ?? uuidv4(),
        dto.name,
        dto.email,
        dto.bot_id ?? null,
        dto.device_ids ?? [],
      ],
    );
    return result.rows[0];
  },

  async update(id: string, dto: UpdateUserDTO): Promise<User | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (dto.name       !== undefined) { fields.push(`name = $${idx++}`);       values.push(dto.name); }
    if (dto.email      !== undefined) { fields.push(`email = $${idx++}`);       values.push(dto.email); }
    if (dto.bot_id     !== undefined) { fields.push(`bot_id = $${idx++}`);      values.push(dto.bot_id); }
    if (dto.device_ids !== undefined) { fields.push(`device_ids = $${idx++}`);  values.push(dto.device_ids); }

    if (fields.length === 0) return null;

    values.push(id);
    const result = await pool.query<User>(
      `UPDATE users SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values,
    );
    return result.rows[0] ?? null;
  },

  async appendDeviceIds(id: string, newIds: string[]): Promise<User> {
    const result = await pool.query<User>(
      `UPDATE users
       SET device_ids = (
         SELECT ARRAY(SELECT DISTINCT unnest(device_ids || $1::TEXT[]))
       )
       WHERE id = $2
       RETURNING *`,
      [newIds, id],
    );
    return result.rows[0];
  },

  async delete(id: string): Promise<boolean> {
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1',
      [id],
    );
    return (result.rowCount ?? 0) > 0;
  },
};
