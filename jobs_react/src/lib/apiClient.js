import axios from 'axios';

const envBaseUrl = import.meta.env?.VITE_API_BASE_URL?.trim();
const normalizedBaseUrl = envBaseUrl
  ? `${envBaseUrl.replace(/\/+$/, '')}/`
  : '/api/';

const apiClient = axios.create({
  baseURL: normalizedBaseUrl,
});

apiClient.interceptors.request.use((config) => {
  if (typeof config.url === 'string' && config.url.startsWith('/')) {
    config.url = config.url.slice(1);
  }
  return config;
});

export const getApiBaseUrl = () => normalizedBaseUrl;

export default apiClient;