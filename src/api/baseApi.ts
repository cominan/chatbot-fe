import axios from 'axios';
import { notification } from 'antd';

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Extract error message
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred';
    const statusCode = error.response?.status;

    // Handle specific status codes
    if (statusCode === 401) {
      // Clear token and redirect to login
      localStorage.removeItem('token');
      notification.error({
        message: 'Authentication Error',
        description: 'Your session has expired. Please login again.',
        placement: 'topRight',
      });
      window.location.href = '/login';
    } else if (statusCode === 403) {
      notification.error({
        message: 'Access Denied',
        description: errorMessage,
        placement: 'topRight',
      });
    } else if (statusCode === 404) {
      notification.error({
        message: 'Not Found',
        description: errorMessage,
        placement: 'topRight',
      });
    } else if (statusCode === 500) {
      console.log("Vào 500");
      
      notification.error({
        message: 'Server Error',
        description: 'An internal server error occurred. Please try again later.',
        placement: 'topRight',
      });
    } else if (error.code === 'ECONNABORTED') {
      notification.error({
        message: 'Request Timeout',
        description: 'The request took too long. Please try again.',
        placement: 'topRight',
      });
    } else if (error.code === 'ERR_NETWORK') {
      notification.error({
        message: 'Network Error',
        description: 'Unable to connect to the server. Please check your internet connection.',
        placement: 'topRight',
      });
    } else {
      // Generic error notification
      notification.error({
        message: 'Error',
        description: errorMessage,
        placement: 'topRight',
      });
    }

    return Promise.reject(error);
  }
);