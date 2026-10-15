import axios from 'axios';

const getBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) {
    return envUrl.endsWith('/api') ? envUrl : `${envUrl.replace(/\/+$/, '')}/api`;
  }
  return '/api';
};

const API = axios.create({
  baseURL: getBaseUrl(),
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => {
    // If the response is HTML string (occurs when VITE_API_URL is missing and Vercel returns index.html)
    if (
      typeof response.data === 'string' &&
      (response.data.trim().startsWith('<!DOCTYPE') || response.data.trim().startsWith('<html'))
    ) {
      const error = new Error(
        'Backend unreachable. Received HTML instead of JSON. Ensure VITE_API_URL is configured in your Vercel project settings pointing to your Render backend URL.'
      );
      error.isHtmlFallback = true;
      return Promise.reject(error);
    }
    return response;
  },
  (error) => {
    if (!error.response) {
      // Network error, CORS rejection, or backend container sleeping
      error.message =
        error.message ||
        'Cannot connect to backend server. Please verify your Render service is active and CORS is configured.';
    }
    return Promise.reject(error);
  }
);

export default API;
