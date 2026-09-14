import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api/CasePortal',
  headers: {
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && !config.url.includes('/auth/')) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const hadAuthHeader = !!error.config?.headers?.Authorization;
    
    if (status === 401 && hadAuthHeader) {
      localStorage.removeItem('token');
      window.location.href = '/login?sessionExpired=true';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
