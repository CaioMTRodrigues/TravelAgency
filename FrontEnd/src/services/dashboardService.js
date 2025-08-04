import api from './api';

// Função para buscar os dados do dashboard
export const getDashboardStats = async () => {
  try {
    // O token de autorização já é adicionado automaticamente pelo interceptor em 'api.js'
    const response = await api.get('/dashboard/stats');
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar estatísticas do dashboard:", error);
    // Retorna um objeto com valores padrão em caso de erro para não quebrar a UI
    return {
      totalPackages: 0,
      pendingReservations: 0,
      newReviews: 0,
    };
  }
};