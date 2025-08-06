import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPacoteById } from '../services/pacoteService';
import { cadastrarReserva } from '../services/reservaService';
import { listarViajantesDoUsuario } from '../services/viajanteService';
import { vincularViajanteReserva } from '../services/reservationTravelerService';
import FormasPagamento from '../components/FormasPagamento';
import ModalViajante from '../components/ModalViajante';
import Spinner from '../components/Spinner';
import './CadastroReserva.css';

const CadastroReserva = () => {
  const { id_pacote } = useParams();
  const navigate = useNavigate();

  const [pacote, setPacote] = useState(null);
  const [viajantes, setViajantes] = useState([]);
  const [viajantesSelecionados, setViajantesSelecionados] = useState([]);
  const [reservaCriada, setReservaCriada] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [etapa, setEtapa] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viajantePrincipal, setViajantePrincipal] = useState(null);

  
const idUsuario = localStorage.getItem("idUsuario");

  useEffect(() => {

  if (!idUsuario) {
    setError("Usuário não identificado. Faça login novamente.");
    return;
  }

    const fetchInitialData = async () => {
      try {
        const pacoteData = await getPacoteById(id_pacote);
        setPacote(pacoteData);

        const idUsuario = localStorage.getItem("id_usuario");
        const viajantesData = await listarViajantesDoUsuario(idUsuario);
        setViajantes(viajantesData);
      } catch (err) {
        setError('Falha ao carregar dados. Tente novamente.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [id_pacote]);

  const handleViajanteChange = (viajanteId) => {
    setViajantesSelecionados(prev =>
      prev.includes(viajanteId)
        ? prev.filter(id => id !== viajanteId)
        : [...prev, viajanteId]
    );
  };

  const handleConfirmarViajantes = async () => {
    if (viajantesSelecionados.length === 0) {
      setError("Selecione ao menos um viajante.");
      return;
    }
    setError('');
    setLoading(true);

    try {
      const dadosReserva = {
        id_Pacote: parseInt(id_pacote, 10),
        quantidade_Viajantes: viajantesSelecionados.length,
        valor_Total: pacote.preco * viajantesSelecionados.length,
      };

      const novaReserva = await cadastrarReserva(dadosReserva);
      setReservaCriada(novaReserva);

      for (const viajanteId of viajantesSelecionados) {
        await vincularViajanteReserva({
          id_Reserva: novaReserva.id_Reserva,
          id_Viajante: viajanteId,
        });
      }

      setEtapa(2);
    } catch (err) {
      console.error("Erro ao criar reserva:", err);
      setError("Ocorreu um erro ao confirmar a reserva. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  if (loading && !reservaCriada) {
    return <Spinner />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="cadastro-reserva-container">
      <h2>
        Reserva para: {viajantePrincipal ? viajantePrincipal.nome : pacote?.nome}
      </h2>

      {etapa === 1 && (
        <div className="etapa-viajantes">
          <h3>Selecione os Viajantes</h3>
          <div className="lista-viajantes">
            {viajantes.map(v => (
              <div key={v.id_Viajante} className="viajante-item">
                <input
                  type="checkbox"
                  id={`viajante-${v.id_Viajante}`}
                  checked={viajantesSelecionados.includes(v.id_Viajante)}
                  onChange={() => handleViajanteChange(v.id_Viajante)}
                />
                <label htmlFor={`viajante-${v.id_Viajante}`}>{v.nome}</label>
              </div>
            ))}
          </div>
          <button onClick={() => setIsModalOpen(true)} className="btn-secondary">
            Adicionar Novo Viajante
          </button>
          <button onClick={handleConfirmarViajantes} className="btn-primary" disabled={loading}>
            {loading ? 'Processando...' : 'Confirmar Viajantes e Ir para Pagamento'}
          </button>
        </div>
      )}

      {etapa === 2 && reservaCriada && (
        <div className="etapa-pagamento">
          <h3>Resumo da Reserva</h3>
          <p><strong>Pacote:</strong> {pacote.nome}</p>
          <p><strong>Viajantes:</strong> {viajantesSelecionados.length}</p>
          <p><strong>Valor Total:</strong> R$ {reservaCriada.valor_Total.toFixed(2)}</p>
          <hr />
          <FormasPagamento
            reservationId={reservaCriada.id_Reserva}
            onPaymentSuccess={() => console.log("Pagamento concluído com sucesso!")}
          />
        </div>
      )}

      <ModalViajante
        idUsuario={localStorage.getItem("id_usuario")}
        onSelecionar={(v) => setViajantePrincipal(v)}
        onFechar={() => setIsModalOpen(false)}
        isOpen={isModalOpen}
      />
    </div>
  );
};

export default CadastroReserva;
