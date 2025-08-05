import React, { useState, useEffect } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from './Spinner'; // Assumindo que você tem um componente Spinner
import { getReservaById } from '../services/reservaService'; // Para buscar detalhes da reserva
import { getPacoteById } from '../services/pacoteService'; // Para buscar detalhes do pacote
import { FaLock, FaCheckCircle, FaTimesCircle, FaInfoCircle, FaPlaneDeparture } from 'react-icons/fa'; // Ícones para feedback

const FormasPagamento = () => {
  const { id: reservationId } = useParams(); // ID da reserva
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true); // Começa como true para carregar dados
  const [processingPayment, setProcessingPayment] = useState(false); // Para o botão de pagamento
  const [paymentError, setPaymentError] = useState(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [reservationDetails, setReservationDetails] = useState(null);
  const [packageDetails, setPackageDetails] = useState(null);

  // Opções de estilo para o CardElement
  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  useEffect(() => {
    const fetchReservationAndCreatePaymentIntent = async () => {
      setLoading(true);
      setPaymentError(null);
      try {
        // 1. Buscar detalhes da reserva
        const reserva = await getReservaById(reservationId);
        if (!reserva) {
          throw new Error('Reserva não encontrada.');
        }
        setReservationDetails(reserva);

        // 2. Buscar detalhes do pacote associado à reserva
        const pacote = await getPacoteById(reserva.id_Pacote);
        if (!pacote) {
          throw new Error('Pacote associado à reserva não encontrado.');
        }
        setPackageDetails(pacote);

        // 3. Chamar o back-end para criar o PaymentIntent
        const response = await axios.post('http://localhost:5000/api/Payment/create-payment-intent', {
          // Usar o valor real da reserva, que agora está em reservation.ValorPacote
          amount: reserva.valorPacote, 
          currency: 'brl', // Assumindo BRL, ajuste se necessário
          reservationId: reservationId
        });
        setClientSecret(response.data.clientSecret);
      } catch (err) {
        console.error("Erro ao carregar detalhes da reserva ou criar PaymentIntent:", err);
        setPaymentError(err.response?.data?.error || err.message || 'Erro ao preparar o pagamento. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchReservationAndCreatePaymentIntent();
  }, [reservationId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessingPayment(true);
    setPaymentError(null);
    setPaymentSuccess(false);

    if (!stripe || !elements) {
      // Stripe.js ainda não carregou
      setProcessingPayment(false);
      return;
    }

    // Confirma o pagamento com os dados do cartão
    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (stripeError) {
      setPaymentError(stripeError.message);
      setProcessingPayment(false);
    } else if (paymentIntent.status === 'succeeded') {
      setPaymentSuccess(true);
      // Aqui você pode chamar seu back-end para atualizar o status da reserva para "Pago"
      // Ex: await axios.put(`http://localhost:5000/api/reservas/${reservationId}/status`, { status: 'Pago' });
      setTimeout(() => {
        navigate('/minhas-reservas'); // Redirecionar após um pequeno atraso para o usuário ver a mensagem de sucesso
      }, 2000);
    } else {
      // Lidar com outros status de pagamento (e.g., requires_action, processing)
      setPaymentError(`Pagamento ${paymentIntent.status}. Por favor, verifique sua reserva.`);
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-150px)]">
        <Spinner />
        <p className="ml-2 text-gray-700">Carregando detalhes do pagamento...</p>
      </div>
    );
  }

  if (paymentError && !clientSecret) {
    // Erro inicial ao carregar ou criar PaymentIntent
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] text-red-600">
        <FaTimesCircle className="text-5xl mb-4" />
        <p className="text-lg font-semibold">{paymentError}</p>
        <p className="text-sm text-gray-600 mt-2">Por favor, tente novamente mais tarde ou contate o suporte.</p>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-150px)] bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full bg-white shadow-xl rounded-lg p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Coluna da Esquerda: Resumo da Reserva */}
        <div className="md:border-r md:pr-8">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center">
            <FaPlaneDeparture className="mr-3 text-indigo-600" />
            Resumo da Sua Viagem
          </h2>
          {reservationDetails && packageDetails ? (
            <div className="space-y-4">
              <img src={packageDetails.imagemUrl || "https://placehold.co/400x200/cccccc/333333?text=Imagem+do+Pacote"} alt={packageDetails.titulo} className="w-full h-48 object-cover rounded-lg shadow-md mb-4" />
              <p className="text-xl font-semibold text-gray-800">{packageDetails.titulo}</p>
              <p className="text-gray-600">Destino: {packageDetails.destino}</p>
              <div className="border-t border-gray-200 pt-4 mt-4">
                <p className="text-lg font-medium text-gray-700">Valor Total:</p>
                <p className="text-3xl font-bold text-indigo-600">
                  R$ {reservationDetails.valorPacote?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                </p>
              </div>
              <p className="text-sm text-gray-500 mt-4 flex items-center">
                <FaInfoCircle className="mr-2 text-blue-500" />
                A confirmação final será enviada por e-mail após o pagamento.
              </p>
            </div>
          ) : (
            <p className="text-gray-600">Não foi possível carregar os detalhes da reserva.</p>
          )}
        </div>

        {/* Coluna da Direita: Formulário de Pagamento */}
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center">
            <FaLock className="mr-3 text-green-600" />
            Informações de Pagamento
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-4 border border-gray-300 rounded-lg shadow-sm focus-within:border-indigo-500">
              <label htmlFor="card-element" className="block text-sm font-medium text-gray-700 mb-2">
                Detalhes do Cartão
              </label>
              <CardElement id="card-element" options={CARD_ELEMENT_OPTIONS} />
            </div>

            <button
              type="submit"
              disabled={!stripe || processingPayment || paymentSuccess}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white transition-colors duration-200
                ${(!stripe || processingPayment || paymentSuccess) ? 'bg-indigo-300 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'}`
              }
            >
              {processingPayment ? (
                <>
                  <Spinner size="small" className="mr-2" /> Processando...
                </>
              ) : paymentSuccess ? (
                <>
                  <FaCheckCircle className="mr-2" /> Pagamento Confirmado!
                </>
              ) : (
                'Pagar Agora'
              )}
            </button>

            {paymentError && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md flex items-center">
                <FaTimesCircle className="mr-2" />
                {paymentError}
              </div>
            )}
            {paymentSuccess && (
              <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md flex items-center">
                <FaCheckCircle className="mr-2" />
                Pagamento realizado com sucesso! Redirecionando...
              </div>
            )}
            
            <div className="text-center text-sm text-gray-500 mt-6 flex items-center justify-center">
                <FaLock className="mr-2 text-green-500" />
                Transação 100% Segura via Stripe
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FormasPagamento;
