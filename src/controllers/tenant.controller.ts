import { Request, Response, NextFunction } from 'express';
import { TenantService } from '../services/tenant.service';
import { sendSuccess } from '../utils/response';

export const TenantController = {
  async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenants = await TenantService.getAllTenants();
      sendSuccess(res, tenants, 'Tenants fetched successfully');
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenant = await TenantService.getTenantById(req.params.tenantId);
      sendSuccess(res, tenant);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenant = await TenantService.createTenant(req.body);
      sendSuccess(res, tenant, 'Tenant created', 201);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenant = await TenantService.updateTenant(req.params.tenantId, req.body);
      sendSuccess(res, tenant, 'Tenant updated');
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await TenantService.deleteTenant(req.params.tenantId);
      sendSuccess(res, null, 'Tenant deleted');
    } catch (err) {
      next(err);
    }
  },
};
