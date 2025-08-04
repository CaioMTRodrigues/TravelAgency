import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBoxOpen, FaTasks, FaStar, FaPlusCircle, FaListAlt, FaCommentDots } from 'react-icons/fa';
import { getDashboardStats } from '../../services/dashboardService';
import Spinner from '../../components/Spinner';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalPackages: 0,
    pendingReservations: 0,
    newReviews: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        // *** CORREÇÃO APLICADA AQUI ***
        // Garantimos que os nomes das propriedades correspondem exatamente
        // ao que o backend envia (geralmente camelCase em JSON).
        setStats({
            totalPackages: data.totalPackages,
            pendingReservations: data.pendingReservations,
            newReviews: data.newReviews
        });
      } catch (error) {
        console.error("Falha ao carregar o dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const recentActivities = [
    { id: 1, type: 'reserva', text: 'Nova reserva para o pacote "Rio de Janeiro" por Carlos Silva.' },
    { id: 2, type: 'avaliacao', text: 'Ana Oliveira deixou uma avaliação de 5 estrelas para "Paris, França".' },
    { id: 3, type: 'reserva', text: 'Nova reserva para o pacote "Gramado" por Juliana Pereira.' },
  ];

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="admin-dashboard">
      <h1 className="dashboard-title">Painel do Administrador</h1>
      
      <div className="stats-container">
        <div className="stat-card">
          <FaBoxOpen className="stat-icon" style={{ color: '#007bff' }} />
          <div className="stat-info">
            <span className="stat-number">{stats.totalPackages}</span>
            <span className="stat-label">Pacotes Ativos</span>
          </div>
        </div>
        <div className="stat-card">
          <FaTasks className="stat-icon" style={{ color: '#ffc107' }} />
          <div className="stat-info">
            <span className="stat-number">{stats.pendingReservations}</span>
            <span className="stat-label">Reservas Pendentes</span>
          </div>
        </div>
        <div className="stat-card">
          <FaStar className="stat-icon" style={{ color: '#28a745' }} />
          <div className="stat-info">
            <span className="stat-number">{stats.newReviews}</span>
            <span className="stat-label">Novas Avaliações</span>
          </div>
        </div>
      </div>

      <div className="actions-container">
        <h2 className="section-title">Ações Rápidas</h2>
        <div className="actions-grid">
          <Link to="/admin/pacotes/cadastro" className="action-card">
            <FaPlusCircle className="action-icon" />
            <span>Cadastrar Novo Pacote</span>
          </Link>
          <Link to="/admin/pacotes" className="action-card">
            <FaListAlt className="action-icon" />
            <span>Gerir Pacotes</span>
          </Link>
          <Link to="/admin/reservas" className="action-card">
            <FaTasks className="action-icon" />
            <span>Ver Todas as Reservas</span>
          </Link>
          <Link to="/admin/avaliacoes" className="action-card">
            <FaCommentDots className="action-icon" />
            <span>Moderar Avaliações</span>
          </Link>
        </div>
      </div>

      <div className="recent-activity-container">
        <h2 className="section-title">Atividade Recente</h2>
        <ul className="activity-list">
          {recentActivities.map(activity => (
            <li key={activity.id} className={`activity-item ${activity.type}`}>
              {activity.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;