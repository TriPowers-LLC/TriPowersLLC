import apiClient from './apiClient';

export const postRegister = (creds) => apiClient.post('/users/register', creds);
export const postLogin    = (creds) => apiClient.post('/users/login', creds);
