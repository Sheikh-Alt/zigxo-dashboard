import { DeviceModel } from '../models/device.model';
import { TenantModel } from '../models/tenant.model';
import { CreateDeviceDTO, UpdateDeviceDTO, Device } from '../types';

export const DeviceService = {
  async getDevicesForTenant(tenantId: string): Promise<Device[]> {
    const tenant = await TenantModel.findById(tenantId);
    if (!tenant) throw new Error(`Tenant not found: ${tenantId}`);
    return DeviceModel.findByTenantId(tenantId);
  },

  // Verifies the device belongs to the given tenant before returning it
  async getDeviceById(tenantId: string, id: string): Promise<Device> {
    const device = await DeviceModel.findById(id);
    if (!device || device.tenant_id !== tenantId) {
      throw new Error(`Device not found: ${id}`);
    }
    return device;
  },

  async createDevice(tenantId: string, dto: CreateDeviceDTO): Promise<Device> {
    const tenant = await TenantModel.findById(tenantId);
    if (!tenant) throw new Error(`Tenant not found: ${tenantId}`);

    const existing = await DeviceModel.findByPhoneNumber(tenantId, dto.phone_number);
    if (existing) {
      // phone number already exists — append new device IDs to the existing record
      return DeviceModel.appendDeviceIds(existing.id, dto.device_ids);
    }

    return DeviceModel.create(tenantId, dto);
  },

  async updateDevice(tenantId: string, id: string, dto: UpdateDeviceDTO): Promise<Device> {
    const device = await DeviceModel.findById(id);
    if (!device || device.tenant_id !== tenantId) {
      throw new Error(`Device not found: ${id}`);
    }

    if (dto.phone_number && dto.phone_number !== device.phone_number) {
      const conflict = await DeviceModel.findByPhoneNumber(tenantId, dto.phone_number);
      if (conflict) throw new Error(`Phone number already taken: ${dto.phone_number}`);
    }

    const updated = await DeviceModel.update(id, dto);
    if (!updated) throw new Error('No fields provided to update');
    return updated;
  },

  async deleteDevice(tenantId: string, id: string): Promise<void> {
    const device = await DeviceModel.findById(id);
    if (!device || device.tenant_id !== tenantId) {
      throw new Error(`Device not found: ${id}`);
    }
    await DeviceModel.delete(id);
  },
};
