import axios from 'axios';
import { getApiBaseUrl as resolveApiBaseUrl } from '../api/baseUrls';

const normalizedBaseUrl = `${resolveApiBaseUrl()}/`;

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
