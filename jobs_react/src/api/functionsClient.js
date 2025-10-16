import axios from 'axios';

// Dedicated client for Azure Functions to avoid affecting ASP.NET API calls
const envBase = import.meta.env.VITE_FUNCTIONS_BASE_URL?.trim();
const base = (envBase ? envBase : '/api').replace(/\/$/, '');

const functionsApi = axios.create({
  baseURL: base,
  headers: { 'Content-Type': 'application/json' }
});

functionsApi.interceptors.request.use((config) => {
  if (typeof config.url === 'string' && config.url.startsWith('/')) {
    config.url = config.url.slice(1);
  }
  return config;
});

export default functionsApi;