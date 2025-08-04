import api from "./api"; // seu axios configurado

export const vincularViajanteReserva = async (idReserva, idViajante) => {
  const response = await api.post("/reservationtraveler", {
    id_Reserva: idReserva,
    id_Viajante: idViajante,
  });
  return response.data;
};

export const desvincularViajanteReserva = async (idReserva, idViajante) => {
  const response = await api.delete(
    `/reservationtraveler/${idReserva}/${idViajante}`
  );
  return response.data;
};

export const listarVinculos = async () => {
  const response = await api.get("/reservationtraveler");
  return response.data;
};

export const buscarVinculo = async (idReserva, idViajante) => {
  const response = await api.get(
    `/reservationtraveler/${idReserva}/${idViajante}`
  );
  return response.data;
};
