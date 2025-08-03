// src/services/usuarioService.js
import api from "./api";

export const cadastrarUsuario = async (dados) => {
  try {
    const response = await api.post("/User/register", dados);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Erro ao cadastrar usuário.";
  }
};
