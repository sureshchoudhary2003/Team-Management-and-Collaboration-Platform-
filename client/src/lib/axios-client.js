import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const options = {
  baseURL,
  withCredentials: true,
  timeout: 10000,
};

const API = axios.create(options);

// Request interceptor to add access token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
API.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error response exists
    if (error.response) {
      const { data, status } = error.response;

      // Don't handle 401 for login, register, or refresh-token endpoints
      const isAuthEndpoint = originalRequest.url?.includes('/auth/login') || 
                             originalRequest.url?.includes('/auth/register') ||
                             originalRequest.url?.includes('/auth/refresh-token');
      
      // Handle 401 Unauthorized - try to refresh token (but not for auth endpoints)
      if (status === 401 && !originalRequest._retry && !isAuthEndpoint) {
        originalRequest._retry = true;

        try {
          // Try to refresh the access token
          const response = await axios.post(
            `${baseURL}/auth/refresh-token`,
            {},
            { withCredentials: true }
          );

          const { accessToken } = response.data.data;
          localStorage.setItem("accessToken", accessToken);

          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return API(originalRequest);
        } catch (refreshError) {
          // Refresh failed, clear token and redirect to login
          localStorage.removeItem("accessToken");
          window.location.href = '/';
          return Promise.reject(refreshError);
        }
      }

      const customError = {
        ...error,
        errorCode: data?.errorCode || "UNKNOWN_ERROR",
      };

      return Promise.reject(customError);
    }

    return Promise.reject(error);
  }
);

export default API;
