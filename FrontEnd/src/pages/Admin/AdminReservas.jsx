import React, { useState, useEffect } from 'react';
import { listarTodasReservas, atualizarStatusReserva } from '../../services/reservaService';
import Spinner from '../../components/Spinner';
import './AdminReservas.css'; // Certifique-se de que este ficheiro CSS existe

const AdminReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const carregarReservas = async () => {
      try {
        // Agora busca os dados reais da sua API
        const data = await listarTodasReservas();
        setReservas(data);
      } catch (err) {
        setError('Falha ao carregar as reservas.');
      } finally {
        setLoading(false);
      }
    };
    carregarReservas();
  }, []); // O array vazio [] garante que a busca aconteça só uma vez

  const handleStatusChange = async (id, novoStatus) => {
    try {
      await atualizarStatusReserva(id, novoStatus);
      // Atualiza o status na lista local para a UI refletir a mudança instantaneamente
      setReservas(reservas.map(r => 
        r.id_Reserva === id ? { ...r, status: novoStatus } : r
      ));
      setSuccess(`Status da reserva #${id} atualizado com sucesso!`);
    } catch (err) {
      setError('Erro ao atualizar o status da reserva.');
    }
    // Limpa a mensagem de feedback após 3 segundos
    setTimeout(() => { setSuccess(''); setError(''); }, 3000);
  };

  const formatarData = (dataString) => {
    // Formata a data para o padrão brasileiro (dd/mm/aaaa)
    return new Date(dataString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="admin-reservas-container">
      <h1>Gerenciamento de Reservas</h1>
      
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <div className="reservas-table-container">
        <table className="reservas-table">
          <thead>
            <tr>
              <th>#ID</th>
              <th>Cliente</th>
              <th>Pacote</th>
              <th>Data da Reserva</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {reservas.length > 0 ? (
              reservas.map(reserva => (
                <tr key={reserva.id_Reserva}>
                  <td>{reserva.id_Reserva}</td>
                  {/* Usamos o 'optional chaining' (?.) para evitar erros se o usuário ou pacote não vierem carregados */}
                  <td>{reserva.usuario?.nome || 'N/A'}</td>
                  <td>{reserva.pacote?.titulo || 'N/A'}</td>
                  <td>{formatarData(reserva.data_Reserva)}</td>
                  <td>
                    {/* O select permite a alteração direta do status */}
                    <select 
                      value={reserva.status} 
                      onChange={(e) => handleStatusChange(reserva.id_Reserva, e.target.value)}
                      className={`status-select status-${reserva.status?.toLowerCase()}`}
                    >
                      <option value="Pendente">Pendente</option>
                      <option value="Confirmada">Confirmada</option>
                      <option value="Cancelada">Cancelada</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-reservas-message">
                  Nenhuma reserva encontrada.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminReservas;