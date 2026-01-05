import axios from 'axios';

// Create axios instance
const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    timeout: 10000
});

let isRefreshing = false;
let failedQueue = [];

// Process queued requests after refresh
const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        console.log('[Axios] Error:', error.response?.status, error.response?.data?.code);

        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        const errorCode = error.response?.data?.code;
        console.log('[Axios] Error code:', errorCode);

        // If no token or profile, do not refresh
        if (errorCode === 'NO_TOKEN' || errorCode === 'NO_PROFILE') {
            console.log('[Axios] No token or profile, redirecting to login');
            return Promise.reject(error);
        }

        // If no token or profile, do not refresh
        if (errorCode === 'TOKEN_EXPIRED' || errorCode === 'INVALID_TOKEN') {
            if (isRefreshing) {
                console.log('[Axios] Already refreshing, queuing request');
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => {
                        return api(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                console.log('[Axios] Attempting to refresh token');
                await api.post('/auth/refresh');

                console.log('[Axios] Token refreshed successfully');
                isRefreshing = false;
                processQueue(null);

                // Retry original request
                return api(originalRequest);
            } catch (refreshError) {
                console.error('[Axios] Refresh failed:', refreshError);
                isRefreshing = false;
                processQueue(refreshError);

                // Refresh failed, redirect to login
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        // Outros erros 401
        return Promise.reject(error);
    }
);

export default api;