import axios from 'axios';

/**
 * Backend mounts all routes under `/api`. Production env often omits `/api` by mistake.
 * Normalize so `https://host` and `https://host/api` both work.
 */
function getApiBaseUrl() {
  const raw = (import.meta.env.VITE_API_URL || '').trim();
  if (!raw) return '/api';
  const base = raw.replace(/\/$/, '');
  return base.endsWith('/api') ? base : `${base}/api`;
}

const api = axios.create({
  baseURL: getApiBaseUrl(),
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
