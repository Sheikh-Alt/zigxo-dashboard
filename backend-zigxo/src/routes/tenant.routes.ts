import { Router } from 'express';
import { TenantController } from '../controllers/tenant.controller';

const router = Router();

router.get('/list',                TenantController.getAll);
router.post('/create',             TenantController.create);
router.get('/get/:tenantId',       TenantController.getById);
router.put('/update/:tenantId',    TenantController.update);
router.delete('/delete/:tenantId', TenantController.remove);

export default router;
