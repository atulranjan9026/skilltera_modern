/**
 * Central API configuration with caching, deduplication, and auth management.
 */
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

// ─── Cache & Deduplication ────────────────────────────────────────────────
const cache = new Map();
const pendingRequests = new Map();

// ─── Axios Instance ───────────────────────────────────────────────────────
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Auth Token Helpers ───────────────────────────────────────────────────
export const setAuthToken = (token) => {
  localStorage.setItem('token', token);
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

export const clearAuthToken = () => {
  localStorage.removeItem('token');
  delete api.defaults.headers.common['Authorization'];
};

// ─── Request Interceptor ──────────────────────────────────────────────────
api.interceptors.request.use((config) => {
  // Always read fresh token (handles race conditions with login/logout)
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Let browser set Content-Type for FormData (multipart boundary)
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
});

// ─── Response Interceptor ─────────────────────────────────────────────────
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// ─── Internal Helpers ─────────────────────────────────────────────────────
const getCachedData = (key, fetcher, ttl = 300000) => {
  if (cache.has(key)) {
    const { data, timestamp } = cache.get(key);
    if (Date.now() - timestamp < ttl) {
      return Promise.resolve(data);
    }
    cache.delete(key);
  }
  return fetcher().then((data) => {
    cache.set(key, { data, timestamp: Date.now() });
    return data;
  });
};

const deduplicateRequest = (key, requestFn) => {
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key);
  }
  const promise = requestFn().finally(() => pendingRequests.delete(key));
  pendingRequests.set(key, promise);
  return promise;
};

const invalidateRelatedCache = (endpoint) => {
  const segment = endpoint.split('/')[1];
  if (!segment) return;
  for (const [key] of cache) {
    if (key.includes(segment)) cache.delete(key);
  }
};

// ─── Public API Methods ───────────────────────────────────────────────────

/** GET with optional caching + deduplication */
export const get = async (endpoint, useCache = true, ttl = 300000) => {
  const cacheKey = `GET:${endpoint}`;
  if (useCache) {
    return getCachedData(cacheKey, () =>
      deduplicateRequest(cacheKey, () => api.get(endpoint)), ttl
    );
  }
  return deduplicateRequest(cacheKey, () => api.get(endpoint));
};

/** POST (no deduplication — mutations should not be deduped) */
export const post = async (endpoint, data) => {
  return data === undefined ? api.post(endpoint) : api.post(endpoint, data);
};

/** PUT with cache invalidation */
export const put = async (endpoint, data) => {
  invalidateRelatedCache(endpoint);
  return api.put(endpoint, data);
};

/** PATCH with cache invalidation */
export const patch = async (endpoint, data) => {
  invalidateRelatedCache(endpoint);
  return api.patch(endpoint, data);
};

/** DELETE with cache cleanup */
export const del = async (endpoint) => {
  invalidateRelatedCache(endpoint);
  return api.delete(endpoint);
};

/** Batch multiple requests */
export const batchRequests = (requests) => {
  return Promise.allSettled(requests.map((req) => api(req)));
};

/** Clear cache for a specific key or all */
export const clearCache = (key) => {
  key ? cache.delete(key) : cache.clear();
};
