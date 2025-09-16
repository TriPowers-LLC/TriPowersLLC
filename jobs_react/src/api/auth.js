import api from './client';

export const postRegister = (creds) => api.post('/users/register', creds);
export const postLogin    = (creds) => api.post('/users/login', creds);
