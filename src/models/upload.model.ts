import { v4 as uuidv4 } from 'uuid';
import { pool } from '../config/database';
import { PdfUpload, CreateUploadDTO } from '../types';

export const UploadModel = {
  async findByTenantId(tenantId: string): Promise<PdfUpload[]> {
    const result = await pool.query<PdfUpload>(
      'SELECT * FROM pdf_uploads WHERE tenant_id = $1 ORDER BY uploaded_at DESC',
      [tenantId],
    );
    return result.rows;
  },

  async findById(id: string): Promise<PdfUpload | null> {
    const result = await pool.query<PdfUpload>(
      'SELECT * FROM pdf_uploads WHERE id = $1',
      [id],
    );
    return result.rows[0] ?? null;
  },

  async create(dto: CreateUploadDTO): Promise<PdfUpload> {
    const result = await pool.query<PdfUpload>(
      `INSERT INTO pdf_uploads (id, tenant_id, original_name, file_path, file_size, mime_type)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [uuidv4(), dto.tenant_id, dto.original_name, dto.file_path, dto.file_size, dto.mime_type],
    );
    return result.rows[0];
  },

  async delete(id: string): Promise<boolean> {
    const result = await pool.query('DELETE FROM pdf_uploads WHERE id = $1', [id]);
    return (result.rowCount ?? 0) > 0;
  },
};
