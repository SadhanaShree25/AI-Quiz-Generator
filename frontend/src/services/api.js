import axios from "axios";

const apiBase =
  import.meta.env.VITE_API_URL?.trim?.() || "http://localhost:5000";
const api = axios.create({
  baseURL: apiBase.endsWith("/api") ? apiBase : `${apiBase.replace(/\/$/, "")}/api`,
});

// ✅ Automatically attach token to every request
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

export default api;
