// jobs_react/src/api/client.js
import axios from 'axios';

// Get base from env and remove trailing slash to avoid /api/api
const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');
console.log ('API base URL:', base);

// Create axios instance

const api = axios.create({
  baseURL: base,                 // e.g. https://api.tripowersllc.com/api
//   timeout: 45000,
  headers: { 'Content-Type': 'application/json' }
});

// Send JWT automatically if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  res => res,
  err => {
    const msg =
      err?.response?.data?.error ||
      err?.response?.data?.message ||
      err?.message || 'Request failed';
    console.error('[API error]', err?.response || err);
    return Promise.reject(new Error(msg));
  }
);

export default api;