// jobs_react/src/lib/jobsApiClient.js
import axios from 'axios';

// Use separate env var just for JobsApi
const envBase = import.meta.env.VITE_JOBS_API_BASE_URL?.trim();

// Fallback to some localhost default; replace PORT with your JobsApi HTTP port
const base = (envBase ? envBase : 'http://localhost:5186').replace(/\/$/, '');

console.log('Jobs API base URL:', base);

const jobsApi = axios.create({
  baseURL: base,
  headers: { 'Content-Type': 'application/json' },
});

export default jobsApi;
