import axios from 'axios';
import { getApiBaseUrl } from './baseUrls';

const rawBase = getApiBaseUrl().replace(/\/+$/, '');
const baseURL = rawBase.endsWith('/api') || rawBase === '/api'
  ? rawBase
  : `${rawBase}/api`;

const apiClient = axios.create({
   baseURL,
  headers: { 'Content-Type': 'application/json' }
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;

  if (typeof config.url === 'string' && config.url.startsWith('/')) {
    config.url = config.url.slice(1);
  }

  return config;
});

apiClient.interceptors.response.use(
  res => res,
  err => {
    const msg =
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      err?.message || 'Request failed';
    return Promise.reject(new Error(msg));
  }
);

export default apiClient;
