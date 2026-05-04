// Helper utility for making API requests with JWT Auth headers

// In production (Vercel), use VITE_API_URL. In local dev, use empty string (Vite proxy handles it).
const API_BASE = import.meta.env.VITE_API_URL || '';

export const fetchWithAuth = async (url, options = {}) => {
  // Strip localhost prefix if present (legacy support), then prepend API_BASE
  let endpoint = url.startsWith('http://localhost:5000')
    ? url.replace('http://localhost:5000', '')
    : url;

  // Prepend the base URL for production
  if (API_BASE && endpoint.startsWith('/')) {
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
  let endpoint = url.startsWith('http://localhost:5000')
    ? url.replace('http://localhost:5000', '')
    : url;

  if (API_BASE && endpoint.startsWith('/')) {
    endpoint = `${API_BASE}${endpoint}`;
  }

  return fetch(endpoint, options);
};
