import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { sendSuccess } from '../utils/response';

export const UserController = {
  async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await UserService.getAllUsers();
      sendSuccess(res, users, 'Users fetched successfully');
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await UserService.getUserById(req.params.id);
      sendSuccess(res, user);
    } catch (err) {
      next(err);
    }
  },

  async getByBotId(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await UserService.getUsersByBotId(req.params.botId);
      sendSuccess(res, users, 'Users fetched successfully');
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await UserService.createUser(req.body);
      sendSuccess(res, user, 'User created', 201);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await UserService.updateUser(req.params.id, req.body);
      sendSuccess(res, user, 'User updated');
    } catch (err) {
      next(err);
    }
  },

  async appendDeviceIds(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await UserService.appendDeviceIds(req.params.id, req.body.device_ids);
      sendSuccess(res, user, 'Device IDs added');
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await UserService.deleteUser(req.params.id);
      sendSuccess(res, null, 'User deleted');
    } catch (err) {
      next(err);
    }
  },
};
