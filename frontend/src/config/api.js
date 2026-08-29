const getApiUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && envUrl.trim() !== '') {
    return envUrl.trim().replace(/\/$/, '');
  }
  // In development without explicit VITE_API_URL, use empty string to leverage the Vite proxy in vite.config.js
  if (import.meta.env.DEV) {
    return '';
  }
  // In production (e.g. Vercel), default to the live Render backend
  return 'https://ecommerce-app-4kjo.onrender.com';
};

export const API_URL = getApiUrl();
