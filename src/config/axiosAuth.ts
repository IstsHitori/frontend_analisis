import axios from "axios";

const clientAxiosAuth = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

// Interceptor para añadir token automáticamente
clientAxiosAuth.interceptors.request.use((config) => {
  const token = localStorage.getItem("analisis-token");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default clientAxiosAuth;
