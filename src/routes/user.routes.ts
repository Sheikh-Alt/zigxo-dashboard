import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const router = Router();

router.get('/list',                      UserController.getAll);
router.post('/create',                   UserController.create);
router.get('/get/:id',                   UserController.getById);
router.get('/bot/:botId',                UserController.getByBotId);
router.put('/update/:id',                UserController.update);
router.patch('/update/:id/device-ids',   UserController.appendDeviceIds);
router.delete('/delete/:id',             UserController.remove);

export default router;
