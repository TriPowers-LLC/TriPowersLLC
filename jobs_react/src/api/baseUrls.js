const trimTrailingSlashes = (value) => value.replace(/\/+$/, '');

const LEGACY_API_HOSTS = ['api.tripowersllc.com'];
const DEPRECATED_API_HOST_SUFFIXES = ['elasticbeanstalk.com'];

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

const hasDeprecatedApiHost = (hostname) =>
  DEPRECATED_API_HOST_SUFFIXES.some((suffix) => hostname === suffix || hostname.endsWith(`.${suffix}`));

const isLegacyApiUrl = (value) => {
  if (!value) {
    return false;
  }

  try {
    const hostname = new URL(value).hostname;
    return LEGACY_API_HOSTS.includes(hostname) || hasDeprecatedApiHost(hostname);
  } catch {
    return LEGACY_API_HOSTS.some((host) => value.includes(host))
      || DEPRECATED_API_HOST_SUFFIXES.some((suffix) => value.includes(suffix));
  }
};

const getPreferredApiOrigin = () => {
  const apiBase = normalizeApiOrigin(readEnvUrl('VITE_API_BASE_URL'));
  const jobsApiBase = normalizeApiOrigin(readEnvUrl('VITE_JOBS_API_BASE_URL'));

  // Prefer dedicated jobs API origin when present (deployments may keep stale generic API env values).
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

  // Default to same-origin API path in production to avoid hard-coded host timeouts.
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
