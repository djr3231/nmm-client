import { apiClient } from './client';
import { User, CreateUserDto, UpdateUserDto } from '@/types/index';

export const usersApi = {
  async getAll(): Promise<User[]> {
    const response = await apiClient.get<User[]>('/users');
    return response.data || [];
  },

  async getById(id: number): Promise<User> {
    const response = await apiClient.get<User>(`/users/${id}`);
    if (!response.data) throw new Error('User not found');
    return response.data;
  },

  async create(data: CreateUserDto): Promise<User> {
    const response = await apiClient.post<User>('/users', data);
    if (!response.data) throw new Error('Failed to create user');
    return response.data;
  },

  async update(id: number, data: UpdateUserDto): Promise<User> {
    const response = await apiClient.put<User>(`/users/${id}`, data);
    if (!response.data) throw new Error('Failed to update user');
    return response.data;
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  },
};