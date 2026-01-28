import axios from "axios";

// API base URL - uses env variable or defaults to localhost
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Create axios instance
const api = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: false,
});

// Request interceptor - adds auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor - handles errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Clear token on unauthorized
            localStorage.removeItem("token");
            localStorage.removeItem("user");
        }
        return Promise.reject(error);
    }
);

// Auth API calls
export const authAPI = {
    signup: (data: { name: string; email: string; password: string }) =>
        api.post("/auth/signup", data),

    login: (data: { email: string; password: string }) =>
        api.post("/auth/login", data),

    logout: () => api.post("/auth/logout"),

    verifyEmail: (token: string) => api.get(`/auth/verify/${token}`),

    forgotPassword: (email: string) =>
        api.post("/auth/forgot-password", { email }),

    resetPassword: (data: { email: string; otp: string; newPassword: string }) =>
        api.post("/auth/reset-password", data),
};

export default api;
