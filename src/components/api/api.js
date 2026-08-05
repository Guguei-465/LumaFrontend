import axios from "axios";

// Create reusable axios instance
const api = axios.create({
    baseURL: "https://ryacksonfungo.alwaysdata.net/api/",
    headers: {
        "Content-Type": "application/json"
    }
});

// Auto-attach JWT token to protected routes
api.interceptors.request.use((config) => {
    const access = localStorage.getItem("access");
    // Skip auth header only for login endpoint
    if (access && !config.url.includes("accounts/login/")) {
        config.headers.Authorization = `Bearer ${access}`;
    }
    return config;
}, (error) => Promise.reject(error));

// Auto-handle 401 expired tokens
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("access");
            localStorage.removeItem("user");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;