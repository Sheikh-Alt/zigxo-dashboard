import { v4 as uuid } from 'uuid';
import { pool } from '../config/database';

export interface InstructionSet {
  id: string; agent_id: string; system_prompt: string; created_at: Date; updated_at: Date;
}
export interface ConversationStarter {
  id: string; instruction_id: string; text: string; sort_order: number; created_at: Date;
}
export interface ReferenceFile {
  id: string; instruction_id: string; name: string; type: 'file' | 'url';
  mime_type: string | null; size_bytes: number | null;
  local_key: string | null; gcs_key: string | null; source_url: string | null;
  status: 'pending' | 'processing' | 'ready' | 'error'; error_msg: string | null;
  created_at: Date; updated_at: Date;
}

export const InstructionSetModel = {
  async findByAgent(agentId: string): Promise<InstructionSet | null> {
    const { rows } = await pool.query('SELECT * FROM instruction_sets WHERE agent_id=$1', [agentId]);
    return rows[0] ?? null;
  },
  async upsertPrompt(agentId: string, systemPrompt: string): Promise<InstructionSet> {
    const { rows } = await pool.query(
      `INSERT INTO instruction_sets (id, agent_id, system_prompt) VALUES ($1,$2,$3)
       ON CONFLICT (agent_id) DO UPDATE SET system_prompt=$3, updated_at=NOW() RETURNING *`,
      [uuid(), agentId, systemPrompt],
    );
    return rows[0];
  },
  async getOrCreate(agentId: string): Promise<string> {
    const { rows } = await pool.query('SELECT id FROM instruction_sets WHERE agent_id=$1', [agentId]);
    if (rows.length) return rows[0].id as string;
    const id = uuid();
    await pool.query(`INSERT INTO instruction_sets (id, agent_id, system_prompt) VALUES ($1,$2,'')`, [id, agentId]);
    return id;
  },
  async deleteById(id: string): Promise<void> {
    await pool.query('DELETE FROM instruction_sets WHERE id=$1', [id]);
  },
  async deleteByAgent(agentId: string): Promise<void> {
    await pool.query('DELETE FROM instruction_sets WHERE agent_id=$1', [agentId]);
  },
  // Starters
  async getStarters(instrId: string): Promise<ConversationStarter[]> {
    const { rows } = await pool.query(
      'SELECT * FROM conversation_starters WHERE instruction_id=$1 ORDER BY sort_order ASC', [instrId],
    );
    return rows;
  },
  async maxStarterOrder(instrId: string): Promise<number> {
    const { rows } = await pool.query(
      `SELECT COALESCE(MAX(sort_order),-1) AS max FROM conversation_starters WHERE instruction_id=$1`, [instrId],
    );
    return rows[0].max as number;
  },
  async addStarter(instrId: string, text: string, sortOrder: number): Promise<ConversationStarter> {
    const { rows } = await pool.query(
      `INSERT INTO conversation_starters (id,instruction_id,text,sort_order) VALUES ($1,$2,$3,$4) RETURNING *`,
      [uuid(), instrId, text, sortOrder],
    );
    return rows[0];
  },
  async deleteStarter(id: string): Promise<boolean> {
    const { rowCount } = await pool.query('DELETE FROM conversation_starters WHERE id=$1', [id]);
    return (rowCount ?? 0) > 0;
  },
  async reorderStarters(orderedIds: string[]): Promise<void> {
    for (let i = 0; i < orderedIds.length; i++) {
      await pool.query('UPDATE conversation_starters SET sort_order=$1 WHERE id=$2', [i, orderedIds[i]]);
    }
  },
  // Reference files
  async getRefFiles(instrId: string): Promise<ReferenceFile[]> {
    const { rows } = await pool.query(
      'SELECT * FROM reference_files WHERE instruction_id=$1 ORDER BY created_at ASC', [instrId],
    );
    return rows;
  },
  async findRefFile(id: string): Promise<ReferenceFile | null> {
    const { rows } = await pool.query('SELECT * FROM reference_files WHERE id=$1', [id]);
    return rows[0] ?? null;
  },
  async createRefFile(id: string, instrId: string, name: string, mimeType: string, sizeBytes: number, key: string): Promise<ReferenceFile> {
    const { rows } = await pool.query(
      `INSERT INTO reference_files (id,instruction_id,name,type,mime_type,size_bytes,local_key,status)
       VALUES ($1,$2,$3,'file',$4,$5,$6,'pending') RETURNING *`,
      [id, instrId, name, mimeType, sizeBytes, key],
    );
    return rows[0];
  },
  async createRefUrl(id: string, instrId: string, url: string): Promise<ReferenceFile> {
    const { rows } = await pool.query(
      `INSERT INTO reference_files (id,instruction_id,name,type,source_url,status)
       VALUES ($1,$2,$3,'url',$4,'pending') RETURNING *`,
      [id, instrId, url, url],
    );
    return rows[0];
  },
  async deleteRefFile(id: string): Promise<boolean> {
    const { rowCount } = await pool.query('DELETE FROM reference_files WHERE id=$1', [id]);
    return (rowCount ?? 0) > 0;
  },
};
