import api from "./api";
import { setToken } from "../utils/tokenUtils";

export const loginUsuario = async (dados) => {
  try {
    const response = await api.post("/User/login", dados);

    console.log("Resposta da API:", response.data);

    setToken(response.data.token); // salva o token
    localStorage.setItem("idUsuario", response.data.idUsuario); // salva o ID corretamente
    return response.data;
  } catch (error) {
    throw error.response?.data?.message || "Erro ao fazer login.";
  }
};
