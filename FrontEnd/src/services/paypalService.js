/*
import api from "./api"; // Importa a instância do axios já configurada

export const createPayPalOrder = async (reservationId) => {
  try {
    const response = await api.post("/payment/create-paypal-order", {
      reservationId: reservationId,
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

export const capturePayPalOrder = async (orderId) => {
  try {
    const response = await api.post("/payment/capture-paypal-order", {
      orderId: orderId,
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
*/
