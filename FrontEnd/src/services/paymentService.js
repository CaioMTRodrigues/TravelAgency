import api from "./api"; // Usa a instância do Axios com baseURL e token

/**
 * Cria uma ordem de pagamento no PayPal através do backend.
 * @param {number} reservationId
 * @returns {Promise<{orderId: string}>}
 */
export const createPayPalOrder = async (reservationId) => {
  try {
    const response = await api.post("/payment/create-paypal-order", {
      reservationId,
      currency: "BRL",
    });
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao criar a ordem no PayPal:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Captura (finaliza) uma ordem de pagamento do PayPal.
 * @param {string} orderId
 * @returns {Promise<any>}
 */
export const capturePayPalOrder = async (orderId) => {
  try {
    const response = await api.post("/payment/capture-paypal-order", {
      orderId,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao capturar a ordem no PayPal:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Cria uma ordem de pagamento simulada com Stripe.
 * @param {number} reservationId
 * @param {string} currency
 * @returns {Promise<{paymentIntentId: string}>}
 */
export const createStripeOrder = async (reservationId, currency = "BRL") => {
  try {
    const response = await api.post("/payment/create-stripe-order", {
      id_Reserva: reservationId,
      valor: 199.99, // ou valor real do pacote
      data_Pagamento: new Date().toISOString(),
      tipo: "Cartao_Credito",
      status: "Pendente",
    });
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao criar ordem Stripe:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Simula a captura de pagamento Stripe.
 * @param {string} paymentIntentId
 * @returns {Promise<any>}
 */
export const captureStripeOrder = async (paymentIntentId) => {
  try {
    const response = await api.post("/payment/capture-stripe-order", {
      paymentIntentId,
    });
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao capturar pagamento Stripe:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const listarFormasPagamento = async () => {
  try {
    const response = await api.get("/payment/formas");
    return response.data;
  } catch (error) {
    console.error(
      "Erro ao buscar formas de pagamento:",
      error.response?.data || error.message
    );
    throw error;
  }
};
