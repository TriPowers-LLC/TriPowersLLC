// jobs_react/src/api/client.js
import axios from 'axios';

// Get base from env and remove trailing slash to avoid /api/api.
// Default to '/api' when no explicit base is supplied so that relative
// requests still target the ASP.NET API when running locally.
const envBase = import.meta.env.VITE_API_BASE_URL?.trim();
const base = (envBase ? envBase : '/api').replace(/\/$/, '');
console.log('API base URL:', base);


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

   // Ensure relative paths so axios appends them to baseURL instead of
  // replacing it entirely when callers mistakenly include a leading slash.
  if (typeof config.url === 'string' && config.url.startsWith('/')) {
    config.url = config.url.slice(1);
  }
  // optional: log the final URL for sanity
  try { console.debug('[API]', new URL(config.url, config.baseURL).href); } catch {}
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