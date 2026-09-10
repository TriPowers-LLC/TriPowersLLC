import apiClient from './apiClient';
import { getApiBaseUrl } from './baseUrls';

export const postRegister = (creds) => apiClient.post('/users/register', creds);
export const postLogin    = (creds) => apiClient.post('/users/login', creds);
export const requestPasswordReset = (username) =>
  apiClient.post('/users/password-reset/request', { username });
export const confirmPasswordReset = (payload) =>
  apiClient.post('/users/password-reset/confirm', payload);

export const getGoogleLoginUrl = () => {
  const configuredBase = getApiBaseUrl().replace(/\/+$/, '');
  if (configuredBase === '/api') return '/api/auth/google';
  const apiOrigin = configuredBase.endsWith('/api')
    ? configuredBase.slice(0, -4)
    : configuredBase;
  return `${apiOrigin}/api/auth/google`;
};
