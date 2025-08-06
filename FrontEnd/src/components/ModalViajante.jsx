import React, { useEffect, useState } from "react";
import { listarViajantesDoUsuario } from "../services/viajanteService";
import { FaTimes, FaUserPlus, FaUserEdit, FaIdCard, FaCalendarAlt } from 'react-icons/fa';
import './ModalViajante.css'; // Importe o novo arquivo de CSS

const ModalViajante = ({ idUsuario, onSelecionar, onCadastrar, onFechar }) => {
  const [viajantes, setViajantes] = useState([]);
  const [erro, setErro] = useState('');

  // Estado unificado para o formulário de novo viajante
  const [novoViajante, setNovoViajante] = useState({
    nome: '',
    documento: '',
    data_Nascimento: '',
  });

  // Busca os viajantes existentes do usuário
  useEffect(() => {
    const fetchViajantes = async () => {
      try {
        const data = await listarViajantesDoUsuario(idUsuario);
        setViajantes(data);
      } catch (err) {
        setErro("Não foi possível carregar os acompanhantes salvos.");
      }
    };
    fetchViajantes();
  }, [idUsuario]);

  // Função genérica para lidar com mudanças nos inputs do formulário
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNovoViajante(prevState => ({ ...prevState, [name]: value }));
  };

  // Lida com o clique do botão de cadastrar
  const handleCadastrarClick = () => {
    const { nome, documento, data_Nascimento } = novoViajante;
    if (!nome || !documento || !data_Nascimento) {
      alert("Por favor, preencha todos os campos para cadastrar um novo acompanhante.");
      return;
    }
    // Passa os dados para o componente pai (CadastroReserva) que fará a chamada da API
    onCadastrar({ ...novoViajante, id_Usuario: idUsuario });

    // Limpa o formulário após o envio
    setNovoViajante({ nome: '', documento: '', data_Nascimento: '' });
  };

  return (
    <div className="modal-backdrop" onClick={onFechar}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Selecionar ou Cadastrar Acompanhante</h3>
          <button onClick={onFechar} className="close-button"><FaTimes /></button>
        </div>

        <div className="modal-body">
          {erro && <p className="error-message">{erro}</p>}

          {/* Seção para selecionar viajantes existentes */}
          <div className="viajantes-lista">
            <h4>Acompanhantes Salvos</h4>
            {viajantes.length > 0 ? (
              <ul>
                {viajantes.map((v) => (
                  <li key={v.id_Viajante}>
                    <span>{v.nome}</span>
                    <button onClick={() => onSelecionar(v)} className="btn-selecionar">Selecionar</button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="lista-vazia">Nenhum acompanhante cadastrado.</p>
            )}
          </div>

          <hr />

          {/* Seção para cadastrar um novo viajante */}
          <div className="novo-viajante-form">
            <h4><FaUserPlus /> Cadastrar Novo</h4>
            <div className="form-group">
              <label htmlFor="nome"><FaUserEdit /> Nome Completo</label>
              <input
                type="text"
                id="nome"
                name="nome"
                placeholder="Nome do acompanhante"
                value={novoViajante.nome}
                onChange={handleFormChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="documento"><FaIdCard /> Documento (CPF ou Passaporte)</label>
              <input
                type="text"
                id="documento"
                name="documento"
                placeholder="CPF ou Passaporte"
                value={novoViajante.documento}
                onChange={handleFormChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="data_Nascimento"><FaCalendarAlt /> Data de Nascimento</label>
              <input
                type="date"
                id="data_Nascimento"
                name="data_Nascimento"
                value={novoViajante.data_Nascimento}
                onChange={handleFormChange}
              />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onFechar} className="btn-secondary">Fechar</button>
          <button onClick={handleCadastrarClick} className="btn-primary">Cadastrar e Adicionar</button>
        </div>
      </div>
    </div>
  );
};

export default ModalViajante;