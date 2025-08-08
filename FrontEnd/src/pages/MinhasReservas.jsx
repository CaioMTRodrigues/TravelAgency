import React, { useEffect, useState } from "react";
// Header e Footer removidos - já são renderizados globalmente no App.js
import Modal from "../components/Modal";
import AuthModal from "../components/AuthModal";
import ConfirmDialog from "../components/ConfirmDialog";
import { FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaTag } from "react-icons/fa";
import { getToken } from "../utils/tokenUtils";
import { useNotification } from "../contexts/NotificationContext";
import api from "../services/api";
import "./../assets/styles/styles.css";

const MinhasReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, reserva: null });
  const { showSuccess, showError, showInfo } = useNotification();

  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const token = getToken();
        
        if (!token) {
          setError("Usuário não autenticado");
          setLoading(false);
          return;
        }

        const response = await api.get("/reservation/user");
        setReservas(response.data);
      } catch (err) {
        console.error("Erro ao buscar reservas:", err);
        if (err.response?.status === 401) {
          setError("Sessão expirada. Faça login novamente.");
        } else if (err.response?.status === 400) {
          setError("Erro de autenticação. ID do usuário não encontrado.");
        } else {
          setError("Erro ao carregar suas reservas");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReservas();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Função para ver detalhes da reserva
  const handleVerDetalhes = (reserva) => {
    console.log("Ver detalhes da reserva:", reserva);
    // Aqui você pode implementar:
    // - Abrir um modal com detalhes
    // - Navegar para uma página de detalhes
    // - Expandir o card com mais informações
    const detalhes = `Detalhes da reserva:

Destino: ${reserva.pacote?.destino || 'N/A'}
Data: ${new Date(reserva.data_Reserva).toLocaleDateString('pt-BR')}
Valor: R$ ${reserva.valorPacote?.toFixed(2) || '0,00'}
Status: ${reserva.status}
Número: ${reserva.numero_Reserva || 'N/A'}`;

    showInfo(detalhes, "Detalhes da Reserva", 10000);
  };

  // Função para cancelar reserva
  const handleCancelarReserva = (reserva) => {
    setConfirmDialog({
      isOpen: true,
      reserva: reserva
    });
  };

  const confirmarCancelamento = async () => {
    const reserva = confirmDialog.reserva;
    setConfirmDialog({ isOpen: false, reserva: null });

    try {
      console.log("Cancelando reserva:", reserva.id_Reserva);
      
      // Chama o novo endpoint específico para cancelamento de usuário
      await api.put(`/reservation/${reserva.id_Reserva}/cancel`);

      // Atualiza a lista de reservas
      setReservas(reservas.map(r => 
        r.id_Reserva === reserva.id_Reserva 
          ? { ...r, status: "Cancelada" }
          : r
      ));

      showSuccess("Reserva cancelada com sucesso!");
    } catch (error) {
      console.error("Erro ao cancelar reserva:", error);
      
      if (error.response?.status === 403) {
        showError("Permissão negada", "Você não tem permissão para cancelar esta reserva.");
      } else if (error.response?.status === 400) {
        showError("Não é possível cancelar", error.response.data?.message || "Não é possível cancelar esta reserva.");
      } else {
        showError("Erro ao cancelar", "Erro ao cancelar reserva. Tente novamente.");
      }
    }
  };

  // Função para renderizar o ícone de status da reserva
  const getStatusIcon = (status) => {
    const statusLower = status?.toLowerCase();
    if (statusLower === 'confirmada') return <FaCheckCircle className="status-icon confirmed" />;
    if (statusLower === 'pendente') return <FaHourglassHalf className="status-icon pending" />;
    if (statusLower === 'cancelada') return <FaTimesCircle className="status-icon cancelled" />;
    if (statusLower === 'concluida') return <FaCheckCircle className="status-icon confirmed" />;
    return null;
  };

  return (
    <div className="home">
      <main className="my-reservations-page">
        <div className="reservations-header">
          <h1>Minhas Reservas</h1>
          <p>Acompanhe aqui o histórico e o status das suas viagens.</p>
        </div>

        {loading ? (
          <p>Carregando suas reservas...</p>
        ) : error ? (
          <div className="no-reservations-box">
            <h2>Erro ao carregar reservas</h2>
            <p>{error}</p>
          </div>
        ) : reservas.length === 0 ? (
          <div className="no-reservations-box">
            <h2>Você ainda não possui nenhuma reserva.</h2>
            <p>Que tal começar a planejar sua próxima aventura agora mesmo?</p>
            <a href="/pacotes" className="quiz-button">Ver Pacotes</a>
          </div>
        ) : (
          <div className="reservations-list">
            {reservas.map((reserva) => (
              <div key={reserva.id_Reserva} className="reservation-card">
                <img 
                  src={reserva.pacote?.imagemUrl || "/default-package.jpg"} 
                  alt={reserva.pacote?.destino || "Destino"} 
                  className="reservation-image" 
                />
                <div className="reservation-details">
                  <div className={`status-badge ${reserva.status.toLowerCase()}`}>
                    {getStatusIcon(reserva.status)}
                    {reserva.status}
                  </div>
                  <h2>{reserva.pacote?.destino || "Destino não disponível"}</h2>
                  <div className="reservation-info">
                    <span><FaCalendarAlt /> {new Date(reserva.data_Reserva).toLocaleDateString('pt-BR')}</span>
                    <span><FaTag /> R$ {reserva.valorPacote?.toFixed(2) || "0,00"}</span>
                  </div>
                  <div className="reservation-actions">
                    <button 
                      className="btn-details"
                      onClick={() => handleVerDetalhes(reserva)}
                    >
                      Ver Detalhes
                    </button>
                    <button 
                      className="btn-cancel"
                      onClick={() => handleCancelarReserva(reserva)}
                      disabled={reserva.status.toLowerCase() === 'cancelada' || reserva.status.toLowerCase() === 'concluida'}
                    >
                      {reserva.status.toLowerCase() === 'cancelada' ? 'Cancelada' : 
                       reserva.status.toLowerCase() === 'concluida' ? 'Concluída' : 'Cancelar'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <AuthModal />
      </Modal>

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onConfirm={confirmarCancelamento}
        onCancel={() => setConfirmDialog({ isOpen: false, reserva: null })}
        title="Cancelar Reserva"
        message={`Tem certeza que deseja cancelar a reserva para ${confirmDialog.reserva?.pacote?.destino || 'este destino'}?`}
        confirmText="Sim, cancelar"
        cancelText="Não, manter"
        type="danger"
      />
    </div>
  );
};

export default MinhasReservas;