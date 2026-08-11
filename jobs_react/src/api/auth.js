import apiClient from './apiClient';

export const postRegister = (creds) => apiClient.post('/users/register', creds);
export const postLogin    = (creds) => apiClient.post('/users/login', creds);
export const requestPasswordReset = (username) =>
  apiClient.post('/users/password-reset/request', { username });
export const confirmPasswordReset = (payload) =>
  apiClient.post('/users/password-reset/confirm', payload);
