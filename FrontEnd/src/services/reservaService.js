// src/services/reservaService.js
import api from "./api";

export const cadastrarReserva = async (dados) => {
  try {
    const response = await api.post("/reservation", dados);
    return response.data;
  } catch (error) {
    console.error("Erro ao cadastrar reserva:", error.response?.data);
    throw new Error(
      error.response?.data?.message || "Erro ao cadastrar reserva."
    );
  }
};
