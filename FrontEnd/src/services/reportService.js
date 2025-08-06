import api from './api';

/**
 * Busca o relatório de reservas no backend.
 * @param {string} startDate - Data de início no formato 'YYYY-MM-DD'
 * @param {string} endDate - Data de fim no formato 'YYYY-MM-DD'
 * @param {string} format - O formato do arquivo ('csv' ou 'pdf')
 * @returns {Promise<Blob>} - Retorna o arquivo como um Blob.
 */
export const exportReservationsReport = async (startDate, endDate, format) => {
  try {
    const response = await api.get('/reports/reservations', {
      params: { startDate, endDate, format },
      // MUITO IMPORTANTE: Indica que a resposta esperada é um arquivo binário.
      responseType: 'blob', 
    });
    return response.data;
  } catch (error) {
    // Tenta extrair a mensagem de erro do blob, caso o backend retorne um erro em JSON
    if (error.response && error.response.data.type === "application/json") {
        const errorText = await error.response.data.text();
        const errorJson = JSON.parse(errorText);
        throw new Error(errorJson.message || 'Erro ao gerar relatório.');
    }
    // Erro genérico
    throw new Error('Não foi possível conectar ao serviço de relatórios.');
  }
};