import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Modal from "../components/Modal";
import AuthModal from "../components/AuthModal";
import { FaCalendarAlt, FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaTag } from "react-icons/fa";
import "./../assets/styles/styles.css";const MinhasReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch("/api/reservas.json")
      .then((res) => res.json())
      .then((data) => {
        setReservas(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Função para renderizar o ícone de status da reserva
  const getStatusIcon = (status) => {
    if (status === 'Confirmada') return <FaCheckCircle className="status-icon confirmed" />;
    if (status === 'Pendente') return <FaHourglassHalf className="status-icon pending" />;
    if (status === 'Cancelada') return <FaTimesCircle className="status-icon cancelled" />;
    return null;
  };

  return (
    <div className="home">
      <Header onLoginClick={openModal} />

      <main className="my-reservations-page">
        <div className="reservations-header">
          <h1>Minhas Reservas</h1>
          <p>Acompanhe aqui o histórico e o status das suas viagens.</p>
        </div>

        {loading ? (
          <p>Carregando suas reservas...</p>
        ) : reservas.length === 0 ? (
          <div className="no-reservations-box">
            <h2>Você ainda não possui nenhuma reserva.</h2>
            <p>Que tal começar a planejar sua próxima aventura agora mesmo?</p>
            <a href="/pacotes" className="quiz-button">Ver Pacotes</a>
          </div>
        ) : (
          <div className="reservations-list">
            {reservas.map((reserva) => (
              <div key={reserva.id} className="reservation-card">
                <img src={reserva.imagem} alt={reserva.destino} className="reservation-image" />
                <div className="reservation-details">
                  <div className={`status-badge ${reserva.status.toLowerCase()}`}>
                    {getStatusIcon(reserva.status)}
                    {reserva.status}
                  </div>
                  <h2>{reserva.destino}</h2>
                  <div className="reservation-info">
                    <span><FaCalendarAlt /> {reserva.data}</span>
                    <span><FaTag /> R$ {reserva.valor}</span>
                  </div>
                  <div className="reservation-actions">
                    <button className="btn-details">Ver Detalhes</button>
                    <button className="btn-cancel">Cancelar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <AuthModal />
      </Modal>
    </div>
  );
};

export default MinhasReservas;