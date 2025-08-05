// src/services/api.js

import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Mantendo HTTP na porta 5000 como padrão do projeto
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
