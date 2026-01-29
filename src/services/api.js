/* Central API configuration and base axios instance with optimizations */
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Cache for GET requests
const cache = new Map();
const pendingRequests = new Map();

// Create axios instance with optimizations
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

/**
 * Set JWT token for authentication
 */
export const setAuthToken = (token) => {
  localStorage.setItem('token', token);
  // Update default headers for future requests
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

/**
 * Clear authentication token
 */
export const clearAuthToken = () => {
  localStorage.removeItem('token');
  delete api.defaults.headers.common['Authorization'];
};

/**
 * Initialize with existing token
 */
const initializeAuth = () => {
  const token = localStorage.getItem('token');
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
};

// Initialize auth on module load
initializeAuth();

// Request interceptor for authentication
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling and caching
api.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      // Handle token refresh or redirect to login
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Get cached data with TTL support
 */
const getCachedData = (key, fetcher, ttl = 300000) => {
  if (cache.has(key)) {
    const { data, timestamp } = cache.get(key);
    if (Date.now() - timestamp < ttl) {
      return Promise.resolve(data);
    }
  }
  
  return fetcher().then(data => {
    cache.set(key, { data, timestamp: Date.now() });
    return data;
  });
};

/**
 * Prevent duplicate requests
 */
const deduplicateRequest = (key, requestFn) => {
  if (pendingRequests.has(key)) {
    return pendingRequests.get(key);
  }
  
  const promise = requestFn().finally(() => {
    pendingRequests.delete(key);
  });
  
  pendingRequests.set(key, promise);
  return promise;
};

/**
 * Batch multiple requests
 */
export const batchRequests = async (requests) => {
  return Promise.allSettled(requests.map(req => api(req)));
};

/**
 * Clear cache for specific key or all cache
 */
export const clearCache = (key) => {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
};

/**
 * Optimized GET request with caching and deduplication
 */
export const get = async (endpoint, useCache = true, ttl = 300000) => {
  const cacheKey = `GET:${endpoint}`;
  
  if (useCache) {
    return getCachedData(cacheKey, () => 
      deduplicateRequest(cacheKey, () => api.get(endpoint)), ttl
    );
  }
  
  return deduplicateRequest(cacheKey, () => api.get(endpoint));
};

/**
 * Optimized POST request
 */
export const post = async (endpoint, data) => {
  const cacheKey = `POST:${endpoint}`;
  return deduplicateRequest(cacheKey, () => api.post(endpoint, data));
};

/**
 * Optimized PUT request with cache invalidation
 */
export const put = async (endpoint, data) => {
  // Clear related cache entries
  for (const [key] of cache) {
    if (key.includes(endpoint.split('/')[1])) {
      cache.delete(key);
    }
  }
  
  const cacheKey = `PUT:${endpoint}`;
  return deduplicateRequest(cacheKey, () => api.put(endpoint, data));
};

/**
 * Optimized DELETE request with cache cleanup
 */
export const del = async (endpoint) => {
  // Clear related cache entries
  for (const [key] of cache) {
    if (key.includes(endpoint.split('/')[1])) {
      cache.delete(key);
    }
  }
  
  const cacheKey = `DELETE:${endpoint}`;
  return deduplicateRequest(cacheKey, () => api.delete(endpoint));
};

// Legacy methods for backward compatibility
export const legacyApi = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
  },

  get: async (endpoint) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!response.ok) throw new Error('API request failed');
      return await response.json();
    } catch (error) {
      console.error('GET request failed:', error);
      throw error;
    }
  },

  post: async (endpoint, data) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: legacyApi.headers,
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('API request failed');
      return await response.json();
    } catch (error) {
      console.error('POST request failed:', error);
      throw error;
    }
  },

  put: async (endpoint, data) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: legacyApi.headers,
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('API request failed');
      return await response.json();
    } catch (error) {
      console.error('PUT request failed:', error);
      throw error;
    }
  },

  delete: async (endpoint) => {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('API request failed');
      return await response.json();
    } catch (error) {
      console.error('DELETE request failed:', error);
      throw error;
    }
  },
};

// Export both new optimized methods and legacy for migration
export { api as axiosInstance };
export default { get, post, put, delete: del, batchRequests, clearCache, legacyApi };
