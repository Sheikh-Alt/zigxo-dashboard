import { Router } from 'express';
import { UploadController } from '../controllers/upload.controller';
import { uploadFile } from '../middleware/upload.middleware';

const router = Router({ mergeParams: true });

router.get('/list',                  UploadController.getUploads);
router.post('/upload', uploadFile,   UploadController.upload);
router.delete('/delete/:uploadId',   UploadController.remove);

export default router;
