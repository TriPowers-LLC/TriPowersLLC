const trimTrailingSlashes = (value) => value.replace(/\/+$/, '');

const LEGACY_API_HOSTS = ['api.tripowersllc.com'];

const readEnvUrl = (key) => import.meta.env[key]?.trim() || '';

const normalizeApiOrigin = (value) => {
  if (!value) {
    return value;
  }

  const trimmedValue = trimTrailingSlashes(value);

  if (typeof window !== 'undefined' && window.location.protocol === 'https:' && trimmedValue.startsWith('http://')) {
    return `https://${trimmedValue.slice('http://'.length)}`;
  }

  return trimmedValue;
};

const isLegacyApiUrl = (value) => {
  if (!value) {
    return false;
  }

  try {
    const hostname = new URL(value).hostname;
    return LEGACY_API_HOSTS.includes(hostname);
  } catch {
    return LEGACY_API_HOSTS.some((host) => value.includes(host));
  }
};

const getPreferredApiOrigin = () => {
  const apiBase = normalizeApiOrigin(readEnvUrl('VITE_API_BASE_URL'));
  const jobsApiBase = normalizeApiOrigin(readEnvUrl('VITE_JOBS_API_BASE_URL'));

  // Prefer dedicated jobs API origin when present.
  if (jobsApiBase && !isLegacyApiUrl(jobsApiBase)) {
    return jobsApiBase;
  }

  if (apiBase && !isLegacyApiUrl(apiBase)) {
    return apiBase;
  }

  if (jobsApiBase) {
    return jobsApiBase;
  }

  if (apiBase) {
    return apiBase;
  }

  return '/api';
};

export const getApiBaseUrl = () => {
  return getPreferredApiOrigin();
};

export const getJobsApiBaseUrl = () => {
  const envBase = normalizeApiOrigin(readEnvUrl('VITE_JOBS_API_BASE_URL'));

  if (envBase) {
    return envBase;
  }

  return getApiBaseUrl();
};
