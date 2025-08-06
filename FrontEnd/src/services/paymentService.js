import api from './api'; // Importa a instância do axios já configurada

/**
 * Cria uma ordem de pagamento no PayPal através do nosso backend.
 * @param {number} reservationId - O ID da reserva para a qual o pagamento está sendo criado.
 * @returns {Promise<{orderId: string}>} - Uma promessa que resolve com o ID da ordem do PayPal.
 */
export const createPayPalOrder = async (reservationId) => {
  try {
    // Faz a chamada para o endpoint que criamos no backend
    const response = await api.post('/payment/create-paypal-order', {
      reservationId: reservationId,
      currency: 'BRL', // Pode ser alterado para 'USD' ou outra moeda, se necessário
    });
    // O backend retorna um objeto no formato { orderId: '...' }
    return response.data;
  } catch (error) {
    // Log detalhado do erro no console do navegador para depuração
    console.error('Erro ao criar a ordem no PayPal:', error.response?.data || error.message);
    throw error; // Lança o erro para que o componente que chamou possa tratá-lo
  }
};

/**
 * Captura (finaliza) uma ordem de pagamento do PayPal após a aprovação do usuário.
 * @param {string} orderId - O ID da ordem do PayPal que foi aprovada.
 * @returns {Promise<any>} - Uma promessa que resolve com a resposta do backend.
 */
export const capturePayPalOrder = async (orderId) => {
  try {
    // Faz a chamada para o endpoint de captura no backend
    const response = await api.post('/payment/capture-paypal-order', {
      orderId: orderId,
    });
    // O backend retorna um objeto com o status do pagamento
    return response.data;
  } catch (error) {
    console.error('Erro ao capturar a ordem no PayPal:', error.response?.data || error.message);
    throw error;
  }
};