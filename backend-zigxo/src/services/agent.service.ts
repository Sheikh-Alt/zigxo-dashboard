import { nanoid } from 'nanoid';
import { AgentModel, CreateAgentDTO, UpdateAgentDTO, Agent } from '../models/agent.model';
import { pool } from '../config/database';
import { storage } from '../config/storage';

export const AgentService = {
  async getAll(): Promise<Agent[]> {
    return AgentModel.findAll();
  },

  async getById(id: string): Promise<Agent> {
    const agent = await AgentModel.findById(id);
    if (!agent) throw Object.assign(new Error(`Agent not found: ${id}`), { statusCode: 404 });
    return agent;
  },

  async create(dto: CreateAgentDTO): Promise<Agent> {
    if (!dto.name?.trim()) throw Object.assign(new Error('name is required'), { statusCode: 400 });

    // Auto-generate a short tenant ID and create a linked tenant record
    const tenantId = `tnt_${nanoid(5)}`;
    await pool.query(
      `INSERT INTO tenants (tenant_id, tenant_name, description) VALUES ($1, $2, $3)`,
      [tenantId, dto.name.trim(), dto.description ?? null],
    );

    return AgentModel.create({ ...dto, tenant_id: tenantId });
  },

  async update(id: string, dto: UpdateAgentDTO): Promise<Agent> {
    const existing = await AgentModel.findById(id);
    if (!existing) throw Object.assign(new Error(`Agent not found: ${id}`), { statusCode: 404 });
    const updated = await AgentModel.update(id, dto);
    if (!updated) throw Object.assign(new Error('Nothing to update'), { statusCode: 400 });

    // Keep tenant name/description in sync with agent
    if (existing.tenant_id && (dto.name !== undefined || dto.description !== undefined)) {
      const fields: string[] = [];
      const vals: unknown[] = [];
      let n = 1;
      if (dto.name        !== undefined) { fields.push(`tenant_name=$${n++}`); vals.push(dto.name); }
      if (dto.description !== undefined) { fields.push(`description=$${n++}`); vals.push(dto.description); }
      fields.push('updated_at=NOW()');
      vals.push(existing.tenant_id);
      await pool.query(`UPDATE tenants SET ${fields.join(',')} WHERE tenant_id=$${n}`, vals);
    }

    return updated;
  },

  async delete(id: string): Promise<void> {
    const existing = await AgentModel.findById(id);
    if (!existing) throw Object.assign(new Error(`Agent not found: ${id}`), { statusCode: 404 });

    // Delete storage files for all data sources
    const { rows: sources } = await pool.query(
      'SELECT local_key, gcs_key FROM data_sources WHERE agent_id=$1', [id],
    );
    for (const src of sources) {
      const key = src.local_key ?? src.gcs_key;
      if (key) await storage.delete(key).catch(() => {});
    }

    // Delete storage files for all reference files
    const { rows: refFiles } = await pool.query(
      `SELECT rf.local_key, rf.gcs_key
       FROM reference_files rf
       JOIN instruction_sets ins ON ins.id = rf.instruction_id
       WHERE ins.agent_id=$1`, [id],
    );
    for (const rf of refFiles) {
      const key = rf.local_key ?? rf.gcs_key;
      if (key) await storage.delete(key).catch(() => {});
    }

    // Delete agent (CASCADE removes data_sources, instruction_sets, reference_files)
    await AgentModel.delete(id);

    // Delete the linked tenant
    if (existing.tenant_id) {
      await pool.query('DELETE FROM tenants WHERE tenant_id=$1', [existing.tenant_id]);
    }
  },
};
