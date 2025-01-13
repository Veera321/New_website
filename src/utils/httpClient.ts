import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { cookieUtils } from './cookies';

// Create axios instance with default config
const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = cookieUtils.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh token
        const refreshToken = cookieUtils.getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post('/auth/refresh', { 
          refreshToken 
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        // Save new tokens
        cookieUtils.setAccessToken(accessToken);
        cookieUtils.setRefreshToken(newRefreshToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // If refresh fails, logout user
        cookieUtils.clearAuthCookies();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const httpClient = {
  get: <T>(url: string, config?: any) => 
    axiosInstance.get<T>(url, config).then(response => response.data),

  post: <T>(url: string, data?: any, config?: any) => 
    axiosInstance.post<T>(url, data, config).then(response => response.data),

  put: <T>(url: string, data?: any, config?: any) => 
    axiosInstance.put<T>(url, data, config).then(response => response.data),

  delete: <T>(url: string, config?: any) => 
    axiosInstance.delete<T>(url, config).then(response => response.data),
};
