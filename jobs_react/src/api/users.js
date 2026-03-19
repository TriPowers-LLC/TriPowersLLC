// src/api/users.js
import api from './apiClient';

export const getMe        = () => api.get('/users/me');
export const updateMe     = (data) => api.put('/users/me', data);
export const getUserById  = (id) => api.get(`/users/${id}`);
export const listUsers    = () => api.get('/users');
export const deleteUser   = (id) => api.delete(`/users/${id}`);
