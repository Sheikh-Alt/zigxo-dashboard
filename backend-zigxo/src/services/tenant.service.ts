import { TenantModel } from '../models/tenant.model';
import { CreateTenantDTO, UpdateTenantDTO, Tenant } from '../types';

export const TenantService = {
  async getAllTenants(): Promise<Tenant[]> {
    return TenantModel.findAll();
  },

  async getTenantById(tenantId: string): Promise<Tenant> {
    const tenant = await TenantModel.findById(tenantId);
    if (!tenant) throw new Error(`Tenant not found: ${tenantId}`);
    return tenant;
  },

  async createTenant(dto: CreateTenantDTO): Promise<Tenant> {
    if (dto.tenant_id) {
      const idConflict = await TenantModel.findById(dto.tenant_id);
      if (idConflict) throw Object.assign(new Error(`Tenant ID already exists: ${dto.tenant_id}`), { statusCode: 409 });
    }
    const existing = await TenantModel.findByName(dto.tenant_name);
    if (existing) throw new Error(`Tenant name already taken: ${dto.tenant_name}`);
    return TenantModel.create(dto);
  },

  async updateTenant(tenantId: string, dto: UpdateTenantDTO): Promise<Tenant> {
    const tenant = await TenantModel.findById(tenantId);
    if (!tenant) throw new Error(`Tenant not found: ${tenantId}`);

    if (dto.tenant_name && dto.tenant_name !== tenant.tenant_name) {
      const conflict = await TenantModel.findByName(dto.tenant_name);
      if (conflict) throw new Error(`Tenant name already taken: ${dto.tenant_name}`);
    }

    const updated = await TenantModel.update(tenantId, dto);
    if (!updated) throw new Error('No fields provided to update');
    return updated;
  },

  async deleteTenant(tenantId: string): Promise<void> {
    const tenant = await TenantModel.findById(tenantId);
    if (!tenant) throw new Error(`Tenant not found: ${tenantId}`);
    await TenantModel.delete(tenantId);
  },
};
