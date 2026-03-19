const trimTrailingSlashes = (value) => value.replace(/\/+$/, '');

const isHostedTriPowersSite = () => {
  if (typeof window === 'undefined') {
    return false;
  }

  return ['tripowersllc.com', 'www.tripowersllc.com'].includes(window.location.hostname);
};

export const getApiBaseUrl = () => {
  const envBase = import.meta.env.VITE_API_BASE_URL?.trim();

  if (envBase && !isHostedTriPowersSite()) {
    return trimTrailingSlashes(envBase);
  }

  return '/api';
};

export const getJobsApiBaseUrl = () => {
  const envBase = import.meta.env.VITE_JOBS_API_BASE_URL?.trim();

  if (envBase && !isHostedTriPowersSite()) {
    return trimTrailingSlashes(envBase);
  }

  return getApiBaseUrl();
};
