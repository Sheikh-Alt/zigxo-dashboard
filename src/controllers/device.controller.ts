import { Request, Response, NextFunction } from 'express';
import { DeviceService } from '../services/device.service';
import { sendSuccess } from '../utils/response';

export const DeviceController = {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const devices = await DeviceService.getDevicesForTenant(req.params.tenantId);
      sendSuccess(res, devices, 'Devices fetched successfully');
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const device = await DeviceService.getDeviceById(req.params.tenantId, req.params.id);
      sendSuccess(res, device);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const device = await DeviceService.createDevice(req.params.tenantId, req.body);
      sendSuccess(res, device, 'Device registered', 201);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const device = await DeviceService.updateDevice(req.params.tenantId, req.params.id, req.body);
      sendSuccess(res, device, 'Device updated');
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await DeviceService.deleteDevice(req.params.tenantId, req.params.id);
      sendSuccess(res, null, 'Device deleted');
    } catch (err) {
      next(err);
    }
  },
};
