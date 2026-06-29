import { UserModel } from '../models/user.model';
import { User, CreateUserDTO, UpdateUserDTO } from '../types';

export const UserService = {
  async getAllUsers(): Promise<User[]> {
    return UserModel.findAll();
  },

  async getUserById(id: string): Promise<User> {
    const user = await UserModel.findById(id);
    if (!user) throw new Error(`User not found: ${id}`);
    return user;
  },

  async getUsersByBotId(botId: string): Promise<User[]> {
    return UserModel.findByBotId(botId);
  },

  async createUser(dto: CreateUserDTO): Promise<User> {
    if (dto.id) {
      const idConflict = await UserModel.findById(dto.id);
      if (idConflict) throw Object.assign(new Error(`User ID already exists: ${dto.id}`), { statusCode: 409 });
    }

    const emailConflict = await UserModel.findByEmail(dto.email);
    if (emailConflict) throw Object.assign(new Error(`Email already registered: ${dto.email}`), { statusCode: 409 });

    return UserModel.create(dto);
  },

  async updateUser(id: string, dto: UpdateUserDTO): Promise<User> {
    const user = await UserModel.findById(id);
    if (!user) throw new Error(`User not found: ${id}`);

    if (dto.email && dto.email !== user.email) {
      const conflict = await UserModel.findByEmail(dto.email);
      if (conflict) throw Object.assign(new Error(`Email already registered: ${dto.email}`), { statusCode: 409 });
    }

    const updated = await UserModel.update(id, dto);
    if (!updated) throw new Error('No fields provided to update');
    return updated;
  },

  async appendDeviceIds(id: string, newIds: string[]): Promise<User> {
    const user = await UserModel.findById(id);
    if (!user) throw new Error(`User not found: ${id}`);
    return UserModel.appendDeviceIds(id, newIds);
  },

  async deleteUser(id: string): Promise<void> {
    const user = await UserModel.findById(id);
    if (!user) throw new Error(`User not found: ${id}`);
    await UserModel.delete(id);
  },
};
