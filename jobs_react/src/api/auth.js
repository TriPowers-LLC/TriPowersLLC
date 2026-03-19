import api from './apiClient';

export const postRegister = (creds) => api.post('/users/register', creds);
export const postLogin    = (creds) => api.post('/users/login', creds);
