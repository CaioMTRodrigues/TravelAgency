// src/services/api.js

import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:5001/api", // Corrigido para HTTPS na porta 5001
  headers: {
    "Content-Type": "application/json",
  },
});

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
