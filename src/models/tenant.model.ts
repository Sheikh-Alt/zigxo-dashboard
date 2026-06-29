import { v4 as uuidv4 } from 'uuid';
import { pool } from '../config/database';
import { Tenant, CreateTenantDTO, UpdateTenantDTO } from '../types';

export const TenantModel = {
  async findAll(): Promise<Tenant[]> {
    const result = await pool.query<Tenant>(
      'SELECT * FROM tenants ORDER BY created_at DESC',
    );
    return result.rows;
  },

  async findById(tenantId: string): Promise<Tenant | null> {
    const result = await pool.query<Tenant>(
      'SELECT * FROM tenants WHERE tenant_id = $1',
      [tenantId],
    );
    return result.rows[0] ?? null;
  },

  async findByName(tenantName: string): Promise<Tenant | null> {
    const result = await pool.query<Tenant>(
      'SELECT * FROM tenants WHERE tenant_name = $1',
      [tenantName],
    );
    return result.rows[0] ?? null;
  },

  async create(dto: CreateTenantDTO): Promise<Tenant> {
    const result = await pool.query<Tenant>(
      `INSERT INTO tenants (tenant_id, tenant_name)
       VALUES ($1, $2)
       RETURNING *`,
      [dto.tenant_id ?? uuidv4(), dto.tenant_name],
    );
    return result.rows[0];
  },

  async update(tenantId: string, dto: UpdateTenantDTO): Promise<Tenant | null> {
    if (!dto.tenant_name) return null;

    const result = await pool.query<Tenant>(
      `UPDATE tenants
       SET tenant_name = $1, updated_at = NOW()
       WHERE tenant_id = $2
       RETURNING *`,
      [dto.tenant_name, tenantId],
    );
    return result.rows[0] ?? null;
  },

  async delete(tenantId: string): Promise<boolean> {
    const result = await pool.query(
      'DELETE FROM tenants WHERE tenant_id = $1',
      [tenantId],
    );
    return (result.rowCount ?? 0) > 0;
  },
};
