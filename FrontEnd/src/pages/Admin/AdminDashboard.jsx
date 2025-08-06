import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBoxOpen, FaTasks, FaStar, FaPlusCircle, FaListAlt, FaCommentDots } from 'react-icons/fa';
import { getDashboardStats } from '../../services/dashboardService';
import { exportReservationsReport } from '../../services/reportService';
import { listarTodasReservas } from '../../services/reservaService'; // Importação adicionada
import { listarTodasAvaliacoes } from '../../services/avaliacaoService'; // Importação adicionada
import Spinner from '../../components/Spinner';
import './AdminDashboard.css';

const AdminDashboard = () => {
  // --- ESTADOS EXISTENTES ---
  const [stats, setStats] = useState({
    totalPackages: 0,
    pendingReservations: 0,
    newReviews: 0,
  });
  const [loading, setLoading] = useState(true);

  // --- NOVO ESTADO PARA ATIVIDADES RECENTES ---
  const [recentActivities, setRecentActivities] = useState([]);

  // --- NOVOS ESTADOS PARA O RELATÓRIO ---
  const [reportStartDate, setReportStartDate] = useState('');
  const [reportEndDate, setReportEndDate] = useState('');
  const [reportFormat, setReportFormat] = useState('csv');
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [reportError, setReportError] = useState('');

  // --- LÓGICA ATUALIZADA PARA BUSCAR STATS E ATIVIDADES ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const statsData = await getDashboardStats();
        setStats({
            totalPackages: statsData.totalPackages,
            pendingReservations: statsData.pendingReservations,
            newReviews: statsData.newReviews
        });

        // Buscando dados reais para as atividades recentes
        const allReservas = await listarTodasReservas();
        const allAvaliacoes = await listarTodasAvaliacoes();

        // Combinando reservas e avaliações em um único array
        const combinedActivities = [
          ...allReservas.map(r => ({
            id: `res-${r.id_Reserva}`,
            type: 'reserva',
            date: new Date(r.data_Reserva),
            text: `Nova reserva para o pacote "${r.pacote?.titulo || 'N/A'}" por ${r.usuario?.name || 'N/A'}.`
          })),
          ...allAvaliacoes.map(a => ({
            id: `eva-${a.id_Avaliacao}`,
            type: 'avaliacao',
            date: new Date(a.data),
            text: `${a.usuario?.name || 'Anônimo'} deixou uma avaliação de ${a.nota} estrelas para "${a.pacote?.titulo || 'N/A'}".`
          }))
        ];

        // Ordenando por data (do mais recente para o mais antigo) e pegando os 5 primeiros
        const sortedActivities = combinedActivities.sort((a, b) => b.date - a.date).slice(0, 5);
        setRecentActivities(sortedActivities);

      } catch (error) {
        console.error("Falha ao carregar o dashboard", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);


  // --- FUNÇÃO PARA GERAR O RELATÓRIO ---
  const handleGenerateReport = async () => {
    if (!reportStartDate || !reportEndDate) {
      setReportError('Por favor, selecione a data de início e de fim.');
      return;
    }
    if (new Date(reportStartDate) > new Date(reportEndDate)) {
      setReportError('A data de início não pode ser maior que a data de fim.');
      return;
    }

    setReportError('');
    setIsReportLoading(true);

    try {
      const blob = await exportReservationsReport(reportStartDate, reportEndDate, reportFormat);
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      const fileName = `relatorio_reservas_${new Date().toISOString().slice(0, 10)}.${reportFormat}`;
      link.setAttribute('download', fileName);
      
      document.body.appendChild(link);
      link.click();
      
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);

    } catch (error) {
      setReportError(error.message || 'Ocorreu um erro desconhecido ao gerar o relatório.');
    } finally {
      setIsReportLoading(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="admin-dashboard">
      <h1 className="dashboard-title">Painel do Administrador</h1>
      
      {/* --- SEÇÃO DE ESTATÍSTICAS --- */}
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

      {/* --- SEÇÃO DE EXPORTAÇÃO DE RELATÓRIOS --- */}
      <div className="admin-reports-container">
        <h2 className="section-title">Exportar Relatório de Reservas</h2>
        <div className="report-filters">
          <div className="filter-group">
            <label htmlFor="start-date">Data de Início:</label>
            <input
              type="date"
              id="start-date"
              value={reportStartDate}
              onChange={(e) => setReportStartDate(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label htmlFor="end-date">Data de Fim:</label>
            <input
              type="date"
              id="end-date"
              value={reportEndDate}
              onChange={(e) => setReportEndDate(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <label htmlFor="format">Formato:</label>
            <select
              id="format"
              value={reportFormat}
              onChange={(e) => setReportFormat(e.target.value)}
            >
              <option value="csv">CSV</option>
              <option value="pdf">PDF</option>
            </select>
          </div>
          <button onClick={handleGenerateReport} disabled={isReportLoading}>
            {isReportLoading ? <Spinner size="small" /> : 'Gerar Relatório'}
          </button>
        </div>
        {reportError && <p className="error-message">{reportError}</p>}
      </div>

      {/* --- SEÇÃO DE AÇÕES RÁPIDAS --- */}
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

      {/* --- SEÇÃO DE ATIVIDADE RECENTE (AGORA DINÂMICA) --- */}
      <div className="recent-activity-container">
        <h2 className="section-title">Atividade Recente</h2>
        <ul className="activity-list">
          {recentActivities.length > 0 ? (
            recentActivities.map(activity => (
              <li key={activity.id} className={`activity-item ${activity.type}`}>
                {activity.text}
              </li>
            ))
          ) : (
            <p>Nenhuma atividade recente.</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;