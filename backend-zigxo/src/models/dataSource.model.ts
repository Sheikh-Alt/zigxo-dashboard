import { pool } from '../config/database';

export interface DataSource {
  id: string; agent_id: string; name: string; type: 'file' | 'url' | 'text';
  mime_type: string | null; size_bytes: number | null;
  local_key: string | null; gcs_key: string | null; source_url: string | null;
  status: 'pending' | 'processing' | 'ready' | 'error';
  chunk_count: number; token_count: number; error_msg: string | null;
  raw_content: string | null;
  created_at: Date; updated_at: Date;
}

export const DataSourceModel = {
  async findByAgent(agentId: string): Promise<DataSource[]> {
    const { rows } = await pool.query(
      'SELECT * FROM data_sources WHERE agent_id=$1 ORDER BY created_at DESC', [agentId],
    );
    return rows;
  },
  async findById(id: string): Promise<DataSource | null> {
    const { rows } = await pool.query('SELECT * FROM data_sources WHERE id=$1', [id]);
    return rows[0] ?? null;
  },
  async createFile(id: string, agentId: string, name: string, mimeType: string, sizeBytes: number, key: string): Promise<DataSource> {
    const { rows } = await pool.query(
      `INSERT INTO data_sources (id,agent_id,name,type,mime_type,size_bytes,local_key,status)
       VALUES ($1,$2,$3,'file',$4,$5,$6,'pending') RETURNING *`,
      [id, agentId, name, mimeType, sizeBytes, key],
    );
    return rows[0];
  },
  async createUrl(id: string, agentId: string, url: string): Promise<DataSource> {
    const { rows } = await pool.query(
      `INSERT INTO data_sources (id,agent_id,name,type,source_url,status)
       VALUES ($1,$2,$3,'url',$4,'pending') RETURNING *`,
      [id, agentId, url, url],
    );
    return rows[0];
  },
  async createText(id: string, agentId: string, name: string, sizeBytes: number): Promise<DataSource> {
    const { rows } = await pool.query(
      `INSERT INTO data_sources (id,agent_id,name,type,size_bytes,status)
       VALUES ($1,$2,$3,'text',$4,'pending') RETURNING *`,
      [id, agentId, name, sizeBytes],
    );
    return rows[0];
  },
  async delete(id: string): Promise<boolean> {
    const { rowCount } = await pool.query('DELETE FROM data_sources WHERE id=$1', [id]);
    return (rowCount ?? 0) > 0;
  },
};
