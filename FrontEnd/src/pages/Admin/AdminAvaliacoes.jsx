import React, { useState, useEffect } from 'react';
import { listarTodasAvaliacoes, excluirAvaliacao } from '../../services/avaliacaoService';
import { FaTrash, FaStar } from 'react-icons/fa';
import Spinner from '../../components/Spinner';
import './AdminAvaliacoes.css'; // Novo CSS para a página

const AdminAvaliacoes = () => {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const carregarAvaliacoes = async () => {
      try {
        const data = await listarTodasAvaliacoes();
        setAvaliacoes(data);
      } catch (err) {
        setError('Falha ao carregar as avaliações.');
      } finally {
        setLoading(false);
      }
    };
    carregarAvaliacoes();
  }, []);

  const handleExcluir = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta avaliação permanentemente?')) {
      try {
        await excluirAvaliacao(id);
        setAvaliacoes(avaliacoes.filter(a => a.id_Avaliacao !== id));
        setSuccess('Avaliação excluída com sucesso!');
      } catch (err) {
        setError('Erro ao excluir a avaliação.');
      }
      setTimeout(() => { setSuccess(''); setError(''); }, 3000);
    }
  };
  
  // Componente para renderizar as estrelas da nota
  const StarRating = ({ nota }) => {
    const totalStars = 5;
    return (
      <div className="star-rating">
        {[...Array(totalStars)].map((_, index) => (
          <FaStar key={index} color={index < nota ? "#ffc107" : "#e4e5e9"} />
        ))}
      </div>
    );
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="admin-avaliacoes-container">
      <h1>Gerenciamento de Avaliações</h1>
      <p className="subtitle">Modere os comentários e avaliações dos seus clientes.</p>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <div className="avaliacoes-grid">
        {avaliacoes.length > 0 ? (
          avaliacoes.map(avaliacao => (
            <div key={avaliacao.id_Avaliacao} className="avaliacao-card">
              <div className="card-header">
                <div className="cliente-info">
                  <strong>{avaliacao.usuario?.nome || 'Anônimo'}</strong>
                  <span>avaliou o pacote</span>
                  <em>"{avaliacao.pacote?.titulo || 'N/A'}"</em>
                </div>
                <div className="card-actions">
                  <button onClick={() => handleExcluir(avaliacao.id_Avaliacao)} className="action-btn delete-btn">
                    <FaTrash /> Excluir
                  </button>
                </div>
              </div>
              <div className="card-body">
                <p className="comentario">"{avaliacao.comentario}"</p>
              </div>
              <div className="card-footer">
                <StarRating nota={avaliacao.nota} />
                <span className="data-avaliacao">
                  {new Date(avaliacao.data).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="no-avaliacoes-message">Nenhuma avaliação encontrada.</p>
        )}
      </div>
    </div>
  );
};

export default AdminAvaliacoes;