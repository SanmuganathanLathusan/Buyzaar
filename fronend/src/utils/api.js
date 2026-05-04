// Helper utility for making API requests with JWT Auth headers

export const fetchWithAuth = async (url, options = {}) => {
  // Use relative path to take advantage of Vite's proxy and avoid CORS issues
  const endpoint = url.startsWith('http://localhost:5000') 
    ? url.replace('http://localhost:5000', '') 
    : url;

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
