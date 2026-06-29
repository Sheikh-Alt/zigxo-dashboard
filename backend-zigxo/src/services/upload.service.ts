import fs from 'fs';
import { UploadModel } from '../models/upload.model';
import { TenantModel } from '../models/tenant.model';
import { PdfUpload } from '../types';

export const UploadService = {
  async getUploadsForTenant(tenantId: string): Promise<PdfUpload[]> {
    const tenant = await TenantModel.findById(tenantId);
    if (!tenant) throw new Error(`Tenant not found: ${tenantId}`);
    return UploadModel.findByTenantId(tenantId);
  },

  async saveUpload(tenantId: string, file: Express.Multer.File): Promise<PdfUpload> {
    const tenant = await TenantModel.findById(tenantId);
    if (!tenant) {
      // Clean up the file that multer already saved to disk
      fs.unlinkSync(file.path);
      throw new Error(`Tenant not found: ${tenantId}`);
    }

    return UploadModel.create({
      tenant_id: tenantId,
      original_name: file.originalname,
      file_path: file.path,
      file_size: file.size,
      mime_type: file.mimetype,
    });
  },

  async deleteUpload(uploadId: string): Promise<void> {
    const upload = await UploadModel.findById(uploadId);
    if (!upload) throw new Error(`Upload not found: ${uploadId}`);

    if (fs.existsSync(upload.file_path)) {
      fs.unlinkSync(upload.file_path);
    }

    await UploadModel.delete(uploadId);
  },
};
