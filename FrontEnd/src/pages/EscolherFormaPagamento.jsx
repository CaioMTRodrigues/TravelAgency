import React, { useState, useEffect } from 'react';
import { cadastrarReserva } from '../services/reservaService';
import { vincularViajanteReserva } from '../services/viajanteService';
import { createStripeOrder, captureStripeOrder, listarFormasPagamento } from '../services/paymentService';
import './EscolherFormaPagamento.css';

const EscolherFormaPagamento = ({ onFechar }) => {
  const [selecionado, setSelecionado] = useState('');
  const [formasPagamento, setFormasPagamento] = useState([]);
  const [erro, setErro] = useState('');

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
    setSelecionado(tipo);
    const reservaTemp = JSON.parse(localStorage.getItem("reservaTemp"));
    if (!reservaTemp) {
      setErro("Dados da reserva não encontrados.");
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
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Escolha a forma de pagamento</h2>
        {erro && <p className="erro">{erro}</p>}
        <div className="opcoes-pagamento">
          {formasPagamento.length > 0 ? (
            formasPagamento.map((forma) => (
              <div
                key={forma.tipo}
                className={`opcao-pagamento ${selecionado === forma.tipo ? 'selecionado' : ''}`}
                onClick={() => handleSelecionar(forma.tipo)}
              >
                <span>{forma.label}</span>
              </div>
            ))
          ) : (
            <p>Carregando opções...</p>
          )}
        </div>
        <button onClick={onFechar}>Fechar</button>
      </div>
    </div>
  );
};

export default EscolherFormaPagamento;
