// src/services/viajanteService.js
import api from "./api"; // seu axios configurado

export const listarViajantesDoUsuario = async (idUsuario) => {
  const response = await api.get(`/traveler/usuario/${idUsuario}`);
  return response.data;
};

export const cadastrarViajante = async (viajante) => {
  const response = await api.post("/traveler", viajante);

  return response.data;
};

export const vincularViajanteReserva = async (idReserva, idViajante) => {
  const response = await api.post("/reservationtraveler", {
    id_Reserva: idReserva,
    id_Viajante: idViajante,
  });
  return response.data;
};

export const buscarViajantesPorNome = async (nomeParcial, idUsuario) => {
  const response = await api.get(
    `/traveler/busca?nome=${nomeParcial}&idUsuario=${idUsuario}`
  );
  return response.data;
};
