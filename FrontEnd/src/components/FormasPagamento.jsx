import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { createPayPalOrder, capturePayPalOrder } from '../services/paymentService';
import { useNotification } from '../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';
import Spinner from './Spinner';

// IMPORTANTE: Substitua pela sua Client ID do PayPal (obtida no painel de desenvolvedor do PayPal).
// O ideal é armazenar isso em um arquivo .env na raiz do seu projeto FrontEnd.
const PAYPAL_CLIENT_ID = "AelSd52cjXFuK-aG2h6oH6In8vTSy_ktWgbmIA2FD-f_d4f1dWkb_H7pu87kxn0w2Y9zNP2mEi8rvcx4";

const FormasPagamento = ({ reservationId, onPaymentSuccess }) => {
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { showSuccess, showError, showWarning } = useNotification();
  const navigate = useNavigate();

  // Chamado quando o usuário clica no botão do PayPal.
  // Comunica-se com nosso backend para criar uma ordem de pagamento.
  const handleCreateOrder = async (data, actions) => {
    setError(null);
    if (!reservationId) {
      
      setError("ID da Reserva não encontrado. Não é possível iniciar o pagamento.");
      return;
    }

    try {
      const { orderId } = await createPayPalOrder(reservationId);
      return orderId; // Retorna o ID da ordem para a biblioteca do PayPal continuar o fluxo.
    } catch (err) {
      setError("Falha ao criar a ordem de pagamento. Verifique o console e tente novamente.");
      return null;
    }
  };

  // Chamado após o usuário aprovar o pagamento na janela do PayPal.
  // Comunica-se com nosso backend para finalizar (capturar) o pagamento.
  const handleOnApprove = async (data, actions) => {
    setIsProcessing(true);
    setError(null);

    try {
      const response = await capturePayPalOrder(data.orderID);
      console.log("Pagamento capturado com sucesso:", response);
      showSuccess("Pagamento realizado com sucesso! Sua reserva foi confirmada.", "Pagamento Aprovado");
      
      if (onPaymentSuccess) {
        onPaymentSuccess();
      }
      
      // Aguarda um pouco para mostrar a notificação antes de navegar
      setTimeout(() => {
        navigate('/minhas-reservas'); // Redireciona o usuário para a página de reservas.
      }, 2000);
    } catch (err) {
      setError("Ocorreu um erro ao finalizar seu pagamento. Por favor, entre em contato com o suporte.");
      showError("Falha no pagamento", "Ocorreu um erro ao finalizar seu pagamento. Por favor, entre em contato com o suporte.");
      setIsProcessing(false);
    }
  };

  // Lida com erros que podem ocorrer no fluxo do PayPal (ex: falha de comunicação).
  const handleOnError = (err) => {
    console.error("Erro no pagamento com PayPal:", err);
    setError("Ocorreu um erro inesperado com o PayPal. Tente novamente mais tarde.");
    setIsProcessing(false);
  };

  // Lida com o evento de o usuário cancelar o pagamento (fechar a janela do PayPal).
  const handleOnCancel = (data) => {
    console.log("Pagamento cancelado pelo usuário.", data);
    setError("O pagamento foi cancelado. Você pode tentar novamente a qualquer momento.");
    showWarning("Pagamento cancelado", "O pagamento foi cancelado. Você pode tentar novamente a qualquer momento.");
    setIsProcessing(false);
  };

  return (
    <div className="payment-container" style={{ maxWidth: '400px', margin: 'auto' }}>
      <h3>Pagamento Seguro com PayPal</h3>
      {isProcessing ? (
        <Spinner />
      ) : (
        <PayPalScriptProvider options={{ "client-id": PAYPAL_CLIENT_ID, currency: "BRL" }}>
          {error && <div className="payment-error" style={{ color: 'red', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}
          
          <PayPalButtons
            style={{ layout: "vertical", color: "blue", shape: "rect", label: "pay" }}
            createOrder={handleCreateOrder}
            onApprove={handleOnApprove}
            onError={handleOnError}
            onCancel={handleOnCancel}
            disabled={!reservationId || isProcessing}
          />
        </PayPalScriptProvider>
      )}
    </div>
  );
};

export default FormasPagamento;