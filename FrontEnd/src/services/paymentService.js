import api from "./api"; // Importa a instância do axios já configurada

import axios from "axios";

/**
 * Cria uma ordem de pagamento no PayPal através do nosso backend.
 * @param {number} reservationId - O ID da reserva para a qual o pagamento está sendo criado.
 * @returns {Promise<{orderId: string}>} - Uma promessa que resolve com o ID da ordem do PayPal.
 */

export const createPayPalOrder = async (reservationId) => {
  try {
    const response = await api.post("/api/payment/create-paypal-order", {
      reservationId,
      currency: "BRL",
    });
    return response.data; // { orderId: '...' }
  } catch (error) {
    console.error("Erro ao criar ordem PayPal:", error);
    throw error;
  }
};

/**
 * Captura (finaliza) uma ordem de pagamento do PayPal após a aprovação do usuário.
 * @param {string} orderId - O ID da ordem do PayPal que foi aprovada.
 * @returns {Promise<any>} - Uma promessa que resolve com a resposta do backend.
 */

export const capturePayPalOrder = async (orderId) => {
  try {
    const response = await api.post("/api/payment/capture-paypal-order", {
      orderId,
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao capturar ordem PayPal:", error);
    throw error;
  }
};

/**
 * Cria uma sessão de checkout e retorna a URL para redirecionamento.
 * @param {object} checkoutData - Dados da reserva e pacote.
 * @returns {Promise<{url: string}>}
 */

export const createCheckoutSession = async (checkoutData) => {
  const token = localStorage.getItem("token");
  const response = await axios.post(
    "http://localhost:5000/api/payment/create-paypal-order",
    {
      reservationId: checkoutData.idReserva,
      currency: "BRL",
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data; // deve conter { orderId }
};
