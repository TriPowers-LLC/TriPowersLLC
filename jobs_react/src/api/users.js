// src/api/users.js
import apiClient from './apiClient';

export const getMe        = () => apiClient.get('/users/me');
export const updateMe     = (data) => apiClient.put('/users/me', data);
export const getUserById  = (id) => apiClient.get(`/users/${id}`);
export const listUsers    = () => apiClient.get('/users');
export const deleteUser   = (id) => apiClient.delete(`/users/${id}`);
