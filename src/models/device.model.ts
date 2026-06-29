import { v4 as uuidv4 } from 'uuid';
import { pool } from '../config/database';
import { Device, CreateDeviceDTO, UpdateDeviceDTO } from '../types';

export const DeviceModel = {
  async findByTenantId(tenantId: string): Promise<Device[]> {
    const result = await pool.query<Device>(
      'SELECT * FROM devices WHERE tenant_id = $1 ORDER BY created_at DESC',
      [tenantId],
    );
    return result.rows;
  },

  async findById(id: string): Promise<Device | null> {
    const result = await pool.query<Device>(
      'SELECT * FROM devices WHERE id = $1',
      [id],
    );
    return result.rows[0] ?? null;
  },

  async findByPhoneNumber(tenantId: string, phoneNumber: string): Promise<Device | null> {
    const result = await pool.query<Device>(
      'SELECT * FROM devices WHERE tenant_id = $1 AND phone_number = $2',
      [tenantId, phoneNumber],
    );
    return result.rows[0] ?? null;
  },

  async create(tenantId: string, dto: CreateDeviceDTO): Promise<Device> {
    const result = await pool.query<Device>(
      `INSERT INTO devices (id, tenant_id, phone_number, device_ids)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [uuidv4(), tenantId, dto.phone_number, dto.device_ids],
    );
    return result.rows[0];
  },

  async update(id: string, dto: UpdateDeviceDTO): Promise<Device | null> {
    const fields: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (dto.phone_number !== undefined) { fields.push(`phone_number = $${idx++}`); values.push(dto.phone_number); }
    if (dto.device_ids !== undefined)   { fields.push(`device_ids = $${idx++}`);   values.push(dto.device_ids); }

    if (fields.length === 0) return null;

    values.push(id);
    const result = await pool.query<Device>(
      `UPDATE devices SET ${fields.join(', ')} WHERE id = $${idx} RETURNING *`,
      values,
    );
    return result.rows[0] ?? null;
  },

  async appendDeviceIds(id: string, newIds: string[]): Promise<Device> {
    const result = await pool.query<Device>(
      `UPDATE devices
       SET device_ids = (
         SELECT ARRAY(
           SELECT DISTINCT unnest(device_ids || $1::TEXT[])
         )
       )
       WHERE id = $2
       RETURNING *`,
      [newIds, id],
    );
    return result.rows[0];
  },

  async delete(id: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM devices WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  },
};
