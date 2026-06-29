import { Request, Response, NextFunction } from 'express';
import { UploadService } from '../services/upload.service';
import { sendSuccess, sendError } from '../utils/response';

export const UploadController = {
  async getUploads(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const uploads = await UploadService.getUploadsForTenant(req.params.tenantId);
      sendSuccess(res, uploads, 'Uploads fetched successfully');
    } catch (err) {
      next(err);
    }
  },

  async upload(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        sendError(res, 'No file provided', 400);
        return;
      }
      const upload = await UploadService.saveUpload(req.params.tenantId, req.file);
      sendSuccess(res, upload, 'File uploaded successfully', 201);
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await UploadService.deleteUpload(req.params.uploadId);
      sendSuccess(res, null, 'Upload deleted');
    } catch (err) {
      next(err);
    }
  },
};
