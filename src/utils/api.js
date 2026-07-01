import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"
});

// Add JWT token to requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers["x-auth-token"] = token; // Also send as x-auth-token for compatibility
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default API;
