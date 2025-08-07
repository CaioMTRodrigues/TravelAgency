import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { listarTodosPacotes, excluirPacote, atualizarDestaquePacote } from '../../services/pacoteService';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import Spinner from '../../components/Spinner';
import './AdminPacotes.css';


import { toast, ToastContainer } from 'react-toastify';


const AdminPacotes = () => {
  const [pacotes, setPacotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const carregarPacotes = async () => {
    try {
      const data = await listarTodosPacotes();
      setPacotes(data);
    } catch (err) {
      
toast.error('Falha ao carregar os pacotes. Tente novamente mais tarde.');

      
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarPacotes();
  }, []);

  const handleDestaqueToggle = async (id, statusAtual) => {
    try {
      await atualizarDestaquePacote(id, !statusAtual);
      setPacotes(pacotes.map(p => 
        p.id_Pacote === id ? { ...p, destaque: !statusAtual } : p
      ));
      
      toast.success('Status de destaque atualizado com sucesso!');

      
    } catch (err) {
      setError(err.toString());
    }
    setTimeout(() => { setSuccess(''); setError(''); }, 3000);
  };

  const handleExcluir = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este pacote?')) {
      try {
        await excluirPacote(id);
        
toast.success('Pacote excluído com sucesso!');

        
        setPacotes(pacotes.filter(p => p.id_Pacote !== id));
      } catch (err) {
        
toast.error('Erro ao excluir o pacote.');

        
      }
      setTimeout(() => { setSuccess(''); setError(''); }, 3000);
    }
  };

  const handleEditar = (id) => {
    navigate(`/admin/pacotes/editar/${id}`);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="admin-pacotes-container">
      <div className="header-container">
        <h1>Gerenciamento de Pacotes</h1>
        <button onClick={() => navigate('/admin/pacotes/cadastro')} className="add-pacote-btn">
          <FaPlus /> Adicionar Novo Pacote
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}

      <div className="pacotes-table-container">
        <table className="pacotes-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Destino</th>
              <th>Valor</th>
              <th>Destaque</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {pacotes.length > 0 ? (
              pacotes.map(pacote => (
                <tr key={pacote.id_Pacote}>
                  <td>{pacote.titulo}</td>
                  <td>{pacote.destino}</td>
                  <td>{`R$ ${pacote.valor.toFixed(2)}`}</td>
                  <td>
                    <label className="toggle-switch">
                      {/*
                        *** CORREÇÃO APLICADA AQUI ***
                        Garantimos que a propriedade 'checked' recebe um valor booleano (true/false).
                        A propriedade 'pacote.destaque' que vem da API já deve ser booleana.
                      */}
                      <input 
                        type="checkbox" 
                        checked={!!pacote.destaque} // O '!!' é uma segurança extra para garantir que o valor é booleano
                        onChange={() => handleDestaqueToggle(pacote.id_Pacote, pacote.destaque)} 
                      />
                      <span className="slider"></span>
                    </label>
                  </td>
                  <td className="actions-cell">
                    <button onClick={() => handleEditar(pacote.id_Pacote)} className="action-btn edit-btn">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleExcluir(pacote.id_Pacote)} className="action-btn delete-btn">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-pacotes-message">
                  Nenhum pacote cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPacotes;