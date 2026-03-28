import axios from 'axios';
import { getApiBaseUrl } from './baseUrls';

const rawBase = getApiBaseUrl().replace(/\/+$/, '');
const baseURL = rawBase.endsWith('/api') || rawBase === '/api'
  ? rawBase
  : `${rawBase}/api`;

const publicApi = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' }
});

publicApi.interceptors.request.use((config) => {
  if (typeof config.url === 'string' && config.url.startsWith('/')) {
    config.url = config.url.slice(1);
  }
  return config;
});

publicApi.interceptors.response.use(
  res => res,
  err => {
    const msg =
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      err?.message ||
      'Request failed';
    return Promise.reject(new Error(msg));
  }
);

export default publicApi;