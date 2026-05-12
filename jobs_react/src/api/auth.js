import apiClient from './apiClient';

export const postRegister = (creds) => apiClient.post('/users/register', creds);
export const postLogin    = (creds) => apiClient.post('/users/login', creds);
export const postRequestPasswordReset = (payload) => apiClient.post('/users/request-password-reset', payload);
export const postResetPassword = (payload) => apiClient.post('/users/reset-password', payload);
