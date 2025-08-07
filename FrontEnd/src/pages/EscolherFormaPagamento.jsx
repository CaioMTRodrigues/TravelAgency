import React, { useState, useEffect } from 'react';
import { cadastrarReserva } from '../services/reservaService';
import { vincularViajanteReserva } from '../services/viajanteService';
import { createStripeOrder, captureStripeOrder, listarFormasPagamento } from '../services/paymentService';
import './EscolherFormaPagamento.css';

// Importando os ícones
import { FaCreditCard, FaRegCreditCard, FaMoneyBillWave } from 'react-icons/fa';

// Um objeto para mapear os tipos de pagamento aos ícones
const paymentIcons = {
  'credit_card': <FaCreditCard className="payment-icon" />,
  'debit_card': <FaRegCreditCard className="payment-icon" />,
  'pix': <FaMoneyBillWave className="payment-icon" />
  // Adicione outros tipos e ícones conforme necessário
};


const EscolherFormaPagamento = ({ onFechar }) => {
  const [selecionado, setSelecionado] = useState('');
  const [formasPagamento, setFormasPagamento] = useState([]);
  const [erro, setErro] = useState('');
  const [processando, setProcessando] = useState(false); // Estado para evitar cliques duplos

  useEffect(() => {
    const fetchFormas = async () => {
      try {
        const formas = await listarFormasPagamento();
        setFormasPagamento(formas);
      } catch (error) {
        console.error("Erro ao carregar formas de pagamento:", error);
        setErro("Não foi possível carregar as formas de pagamento.");
      }
    };
    fetchFormas();
  }, []);

  const handleSelecionar = async (tipo) => {
    if (processando) return; // Impede novos cliques enquanto uma operação está em andamento
    setProcessando(true);
    setSelecionado(tipo);
    setErro(''); // Limpa erros anteriores

    const reservaTemp = JSON.parse(localStorage.getItem("reservaTemp"));
    if (!reservaTemp) {
      setErro("Dados da reserva não encontrados.");
      setProcessando(false);
      return;
    }

    try {
      const reservaCriada = await cadastrarReserva({
        id_Usuario: reservaTemp.idUsuario,
        id_Pacote: reservaTemp.idPacote,
        data_Reserva: reservaTemp.dataReserva,
        status: reservaTemp.status
      });

      await Promise.all(reservaTemp.acompanhantes.map(v =>
        vincularViajanteReserva(reservaCriada.id_Reserva, v.id_Viajante)
      ));

      const { paymentIntentId } = await createStripeOrder(reservaCriada.id_Reserva, tipo);
      await captureStripeOrder(paymentIntentId);

      localStorage.removeItem("reservaTemp");
      alert("Pagamento realizado com sucesso!");
      onFechar();
    } catch (error) {
      console.error("Erro ao processar pagamento:", error);
      setErro("Erro ao processar pagamento. Tente novamente.");
    } finally {
        setProcessando(false); // Libera o botão para novas tentativas
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onFechar}>X</button>
        <h2>Escolha a forma de pagamento</h2>
        {erro && <p className="error-message">{erro}</p>}

        <div className="payment-options">
          {formasPagamento.length > 0 ? (
            formasPagamento.map((forma) => (
              <div
                key={forma.tipo}
                className={`payment-card ${selecionado === forma.tipo ? 'selected' : ''}`}
                onClick={() => handleSelecionar(forma.tipo)}
              >
                {paymentIcons[forma.tipo] || <FaCreditCard className="payment-icon" /> /* Ícone padrão */}
                <h3>{forma.label}</h3>
                <button 
                  className="payment-button"
                  disabled={processando}
                >
                  {processando && selecionado === forma.tipo ? 'Processando...' : `Pagar com ${forma.label}`}
                </button>
              </div>
            ))
          ) : (
            <p>Carregando opções de pagamento...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EscolherFormaPagamento;