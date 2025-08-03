// src/services/pacoteService.js
import api from "./api";

export const cadastrarPacote = async (dados) => {
  console.log("Dados enviados para API:", dados); // 👈

  try {
    const response = await api.post("/package", dados);
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Erro ao cadastrar pacote.";
  }
};

export const listarPacotes = async () => {
  try {
    const response = await api.get("/package");
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Erro ao buscar pacotes.";
  }
};
