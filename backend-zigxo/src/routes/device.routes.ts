import { Router } from 'express';
import { DeviceController } from '../controllers/device.controller';

const router = Router({ mergeParams: true });

router.get('/list',          DeviceController.getAll);
router.post('/create',       DeviceController.create);
router.get('/get/:id',       DeviceController.getById);
router.put('/update/:id',    DeviceController.update);
router.delete('/delete/:id', DeviceController.remove);

export default router;
