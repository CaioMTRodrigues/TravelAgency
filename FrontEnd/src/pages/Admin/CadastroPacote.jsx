import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
// Importamos todas as funções que vamos usar do nosso serviço de pacotes
import { cadastrarPacote, getPacoteById, atualizarPacote } from '../../services/pacoteService';
import { FaSignature, FaFileAlt, FaMapMarkedAlt, FaClock, FaCalendarAlt, FaDollarSign, FaImage } from 'react-icons/fa';
import Spinner from '../../components/Spinner';
import './CadastroPacote.css';

const CadastroPacote = () => {
  const { id } = useParams(); // Pega o ID da URL. Será 'undefined' se for a página de cadastro.
  const navigate = useNavigate();
  const isEditing = Boolean(id); // Converte o ID (ou a falta dele) para um verdadeiro/falso.

  const [pacote, setPacote] = useState({
    titulo: '',
    descricao: '',
    destino: '',
    duracaoDias: '',
    dataInicio: '',
    dataFim: '',
    valor: '',
    imagemUrl: ''
  });
  
  // O loading começa como 'true' apenas se estivermos a editar, para dar tempo de buscar os dados.
  const [loading, setLoading] = useState(isEditing); 
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Este useEffect roda apenas uma vez se 'isEditing' for verdadeiro.
  useEffect(() => {
    if (isEditing) {
      const fetchPacoteParaEdicao = async () => {
        try {
          const data = await getPacoteById(id);
          // O backend retorna datas em formato completo (ISO). Precisamos formatá-las
          // para o formato YYYY-MM-DD que o <input type="date"> entende.
          const dadosFormatados = {
            ...data,
            dataInicio: new Date(data.dataInicio).toISOString().split('T')[0],
            dataFim: new Date(data.dataFim).toISOString().split('T')[0]
          };
          setPacote(dadosFormatados);
        } catch (err) {
          setError('Não foi possível carregar os dados do pacote para edição.');
          console.error(err);
        } finally {
          setLoading(false); // Para o loading após buscar os dados (ou falhar)
        }
      };
      fetchPacoteParaEdicao();
    }
  }, [id, isEditing]); // Dependências do useEffect

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPacote(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validação
    for (const key in pacote) {
      // Ignora o 'id_pacote' que pode vir do backend na validação de campos obrigatórios
      if (pacote[key] === '' && key !== 'id_pacote') {
        setError('Todos os campos são obrigatórios.');
        return;
      }
    }

    try {
      if (isEditing) {
        // Se estivermos a editar, chamamos a função de ATUALIZAR
        await atualizarPacote(id, pacote);
        setSuccess('Pacote atualizado com sucesso! Redirecionando...');
      } else {
        // Se não, chamamos a função de CADASTRAR
        await cadastrarPacote(pacote);
        setSuccess('Pacote cadastrado com sucesso! Redirecionando...');
      }
      
      // Após sucesso, espera 2 segundos e redireciona para a lista de pacotes
      setTimeout(() => {
        navigate('/admin/pacotes');
      }, 2000);

    } catch (err) {
      setError(err.message || `Ocorreu um erro ao ${isEditing ? 'atualizar' : 'cadastrar'} o pacote.`);
    }
  };
  
  // Exibe o spinner enquanto busca os dados no modo de edição
  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="cadastro-pacote-container">
      <div className="form-column">
        {/* O título da página muda dependendo se estamos a criar ou editar */}
        <h1 className="form-title">{isEditing ? 'Editar Pacote' : 'Cadastro de Novo Pacote'}</h1>
        <form onSubmit={handleSubmit} className="pacote-form">
          {/* O formulário em si é o mesmo */}
          <div className="form-group">
            <label><FaSignature /> Título do Pacote</label>
            <input type="text" name="titulo" value={pacote.titulo} onChange={handleChange} placeholder="Ex: Aventura no Rio" />
          </div>
          <div className="form-group">
            <label><FaFileAlt /> Descrição</label>
            <textarea name="descricao" value={pacote.descricao} onChange={handleChange} placeholder="Descreva os detalhes do pacote..."></textarea>
          </div>
          <div className="form-group">
            <label><FaMapMarkedAlt /> Destino</label>
            <input type="text" name="destino" value={pacote.destino} onChange={handleChange} placeholder="Ex: Rio de Janeiro, RJ" />
          </div>
          <div className="form-group-inline">
            <div className="form-group">
              <label><FaClock /> Duração (dias)</label>
              <input type="number" name="duracaoDias" value={pacote.duracaoDias} onChange={handleChange} placeholder="Ex: 7" />
            </div>
            <div className="form-group">
              <label><FaDollarSign /> Valor (R$)</label>
              <input type="number" name="valor" value={pacote.valor} onChange={handleChange} placeholder="Ex: 1500.00" step="0.01" />
            </div>
          </div>
          <div className="form-group-inline">
            <div className="form-group">
              <label><FaCalendarAlt /> Data de Início</label>
              <input type="date" name="dataInicio" value={pacote.dataInicio} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label><FaCalendarAlt /> Data de Fim</label>
              <input type="date" name="dataFim" value={pacote.dataFim} onChange={handleChange} />
            </div>
          </div>
          <div className="form-group">
            <label><FaImage /> URL da Imagem</label>
            <input type="text" name="imagemUrl" value={pacote.imagemUrl} onChange={handleChange} placeholder="https://exemplo.com/imagem.jpg" />
          </div>
          
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          {/* O texto do botão também muda dinamicamente */}
          <button type="submit" className="submit-button">
            {isEditing ? 'Salvar Alterações' : 'Cadastrar Pacote'}
          </button>
        </form>
      </div>
      
      {/* A pré-visualização continua a funcionar como antes, mostrando os dados do 'pacote' */}
      <div className="preview-column">
        <h2 className="preview-title">Pré-visualização do Card</h2>
        <div className="package-card-preview">
          <img 
            src={pacote.imagemUrl || 'https://placehold.co/600x400/005A9C/white?text=Sua+Imagem+Aqui'} 
            alt={pacote.titulo || 'Título do Pacote'} 
            className="package-image-preview"
          />
          <div className="package-info-preview">
            <h3 className="package-name-preview">{pacote.titulo || 'Título do Pacote'}</h3>
            <p className="package-description-preview">{pacote.descricao || 'A descrição do seu pacote aparecerá aqui.'}</p>
            <p className="package-price-preview">
              {pacote.valor ? `R$ ${parseFloat(pacote.valor).toFixed(2)}` : 'R$ 0.00'}
            </p>
            <button className="btn-details-preview" disabled>Ver Detalhes</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CadastroPacote;