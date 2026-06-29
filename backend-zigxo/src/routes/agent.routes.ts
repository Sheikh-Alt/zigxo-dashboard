import { Router } from 'express';
import { AgentController } from '../controllers/agent.controller';

const router = Router();

router.get('/',       AgentController.getAll);
router.post('/',      AgentController.create);
router.get('/:id',    AgentController.getById);
router.patch('/:id',  AgentController.update);
router.delete('/:id', AgentController.remove);

export default router;
