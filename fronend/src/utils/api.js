// Helper utility for making API requests with JWT Auth headers

// Use VITE_API_URL when provided. Otherwise fall back to the local backend in dev.
const API_BASE = import.meta.env.VITE_API_URL || 
  (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:5000' : '');

export const fetchWithAuth = async (url, options = {}) => {
  let endpoint = url;
  if (endpoint.startsWith('/')) {
    endpoint = `${API_BASE}${endpoint}`;
  }

  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  return response;
};

// Helper for plain fetch calls (no auth) with base URL support
export const apiFetch = async (url, options = {}) => {
  let endpoint = url;

  if (endpoint.startsWith('/')) {
    endpoint = `${API_BASE}${endpoint}`;
  }

  // Attempt fetch and wrap network errors with clearer message
  try {
    // Log the outgoing request (helpful for diagnosing wrong URL/env)
    // eslint-disable-next-line no-console
    console.debug('[apiFetch] request:', endpoint, options && options.method ? options.method : 'GET');

    const res = await fetch(endpoint, options);
    return res;
  } catch (err) {
    // Repackage the error so UI can show a more helpful message
    const message = `Network error when requesting ${endpoint}: ${err.message}`;
    // eslint-disable-next-line no-console
    console.error('[apiFetch] network error:', message, err);
    throw new Error(message);
  }
};
