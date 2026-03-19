import axios from 'axios';
import { getJobsApiBaseUrl } from './baseUrls';

const jobsApi = axios.create({
  baseURL: getJobsApiBaseUrl(),
  headers: { 'Content-Type': 'application/json' },
});

jobsApi.interceptors.request.use((config) => {
  if (typeof config.url === 'string' && config.url.startsWith('/')) {
    config.url = config.url.slice(1);
  }

  return config;
});

export default jobsApi;
