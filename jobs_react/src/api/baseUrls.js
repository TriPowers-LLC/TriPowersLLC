const trimTrailingSlashes = (value) => value.replace(/\/+$/, '');

const LEGACY_API_HOST = 'api.tripowersllc.com';
const AWS_API_ORIGIN = 'https://tripowersjobsapi-env.eba-htdmnp7b.us-east-2.elasticbeanstalk.com/api';
const PRODUCTION_SITE_HOSTS = new Set(['tripowersllc.com', 'www.tripowersllc.com']);

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
    return new URL(value).hostname === LEGACY_API_HOST;
  } catch {
    return value.includes(LEGACY_API_HOST);
  }
};

const isProductionSite = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  return PRODUCTION_SITE_HOSTS.has(window.location.hostname);
};

const getPreferredApiOrigin = () => {
  const apiBase = normalizeApiOrigin(readEnvUrl('VITE_API_BASE_URL'));
  const jobsApiBase = normalizeApiOrigin(readEnvUrl('VITE_JOBS_API_BASE_URL'));

  if (apiBase && !isLegacyApiUrl(apiBase)) {
    return apiBase;
  }

  if (jobsApiBase) {
    return jobsApiBase;
  }

  if (apiBase) {
    return apiBase;
  }

  if (isProductionSite()) {
    return AWS_API_ORIGIN;
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
