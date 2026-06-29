import { Router } from 'express';
import multer from 'multer';
import { InstructionSetController } from '../controllers/instructionSet.controller';

const router = Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });

router.get('/:agentId',              InstructionSetController.getByAgent);
router.post('/prompt',               InstructionSetController.savePrompt);
router.post('/starters',             InstructionSetController.addStarter);
router.delete('/starters/:id',       InstructionSetController.deleteStarter);
router.post('/starters/reorder',     InstructionSetController.reorderStarters);
router.post('/reffile/upload',       upload.single('file'), InstructionSetController.uploadRefFile);
router.post('/reffile/url',          InstructionSetController.addRefUrl);
router.get('/reffile/status/:jobId', InstructionSetController.pollRefFileStatus);
router.delete('/reffile/:id',        InstructionSetController.deleteRefFile);
router.post('/reset',                InstructionSetController.reset);

export default router;
