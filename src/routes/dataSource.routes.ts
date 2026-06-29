import { Router } from 'express';
import multer from 'multer';
import { DataSourceController } from '../controllers/dataSource.controller';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

router.get('/:agentId',      DataSourceController.listByAgent);
router.post('/upload',       upload.single('file'), DataSourceController.uploadFile);
router.post('/url',          DataSourceController.ingestUrl);
router.post('/text',         DataSourceController.ingestText);
router.get('/status/:jobId', DataSourceController.pollStatus);
router.delete('/:sourceId',  DataSourceController.remove);

export default router;
