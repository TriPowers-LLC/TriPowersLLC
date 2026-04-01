const trimTrailingSlashes = (value) => value.replace(/\/+$/, '');

const LEGACY_API_HOSTS = [
  'tripowersjobsapi-env.eba-htdmnp7b.us-east-2.elasticbeanstalk.com'
];

const readEnvUrl = (key) => import.meta.env[key]?.trim() || '';

const normalizeApiOrigin = (value) => {
  if (!value) return value;

  return trimTrailingSlashes(value);
};

const isLegacyApiUrl = (value) => {
  if (!value) return false;

  try {
    const hostname = new URL(value).hostname;
    return (
      LEGACY_API_HOSTS.includes(hostname) ||
      hostname.includes('elasticbeanstalk.com')
    );
  } catch {
    return (
      LEGACY_API_HOSTS.some((host) => value.includes(host)) ||
      value.includes('elasticbeanstalk.com')
    );
  }
};

const getPreferredApiOrigin = () => {
  const apiBase = normalizeApiOrigin(readEnvUrl('VITE_API_BASE_URL'));
  const jobsApiBase = normalizeApiOrigin(readEnvUrl('VITE_JOBS_API_BASE_URL'));

  if (jobsApiBase && !isLegacyApiUrl(jobsApiBase)) {
    return jobsApiBase;
  }

  if (apiBase && !isLegacyApiUrl(apiBase)) {
    return apiBase;
  }

  return '/api';
};

export const getApiBaseUrl = () => getPreferredApiOrigin();
export const getJobsApiBaseUrl = () => getApiBaseUrl();