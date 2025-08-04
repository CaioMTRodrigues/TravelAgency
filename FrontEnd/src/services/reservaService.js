import api from "./api";

// Função para buscar todas as reservas com detalhes para o painel de admin
export const listarTodasReservas = async () => {
    try {
        const response = await api.get('/reservation/admin');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar todas as reservas:", error);
        throw error;
    }
};

// Função para atualizar o status de uma reserva específica
export const atualizarStatusReserva = async (id, status) => {
    try {
        // O backend espera um objeto com a propriedade "status"
        const response = await api.put(`/reservation/${id}/status`, { status });
        return response.data;
    } catch (error) {
        console.error(`Erro ao atualizar status da reserva ${id}:`, error);
        throw error;
    }
};

// Sua função existente para cadastrar uma nova reserva
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
