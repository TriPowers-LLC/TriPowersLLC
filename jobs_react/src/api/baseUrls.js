const trimTrailingSlashes = (value) => value.replace(/\/+$/, '');

const LEGACY_API_HOST = 'api.tripowersllc.com';

const readEnvUrl = (key) => import.meta.env[key]?.trim() || '';

const isLegacyApiUrl = (value) => {
  if (!value) {
    return false;
  }

  try {
    return new URL(value).hostname === LEGACY_API_HOST;
  } catch {
    return value.includes(LEGACY_API_HOST);
  }
};

const getPreferredApiOrigin = () => {
  const apiBase = readEnvUrl('VITE_API_BASE_URL');
  const jobsApiBase = readEnvUrl('VITE_JOBS_API_BASE_URL');

  if (apiBase && !isLegacyApiUrl(apiBase)) {
    return trimTrailingSlashes(apiBase);
  }

  if (jobsApiBase) {
    return trimTrailingSlashes(jobsApiBase);
  }

  if (apiBase) {
    return trimTrailingSlashes(apiBase);
  }

  return '/api';
};

export const getApiBaseUrl = () => {
  return getPreferredApiOrigin();
};

export const getJobsApiBaseUrl = () => {
  const envBase = readEnvUrl('VITE_JOBS_API_BASE_URL');

  if (envBase) {
    return trimTrailingSlashes(envBase);
  }

  return getApiBaseUrl();
};
