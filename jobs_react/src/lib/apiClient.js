import axios from 'axios';

const envBaseUrl = import.meta.env?.VITE_API_BASE_URL?.trim();
const normalizedBaseUrl = envBaseUrl
  ? `${envBaseUrl.replace(/\/+$/, '')}/`
  : '/api/';

const apiClient = axios.create({
  baseURL: normalizedBaseUrl,
});

export const getApiBaseUrl = () => normalizedBaseUrl;

export default apiClient;