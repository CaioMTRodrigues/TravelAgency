import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { cadastrarPacote, getPacoteById, atualizarPacote } from '../../services/pacoteService';
import { FaSignature, FaFileAlt, FaMapMarkedAlt, FaClock, FaCalendarAlt, FaDollarSign, FaImage } from 'react-icons/fa';
import Spinner from '../../components/Spinner';
import './CadastroPacote.css';
import axios from "axios";

const CadastroPacote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

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

  const [loading, setLoading] = useState(isEditing);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [camposComErro, setCamposComErro] = useState([]);


  useEffect(() => {
    if (isEditing) {
      const fetchPacoteParaEdicao = async () => {
        try {
          const data = await getPacoteById(id);
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
          setLoading(false);
        }
      };
      fetchPacoteParaEdicao();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPacote(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataImagem = new FormData();
    formDataImagem.append("arquivo", file);

    try {
      const response = await axios.post("http://localhost:5000/api/imagens/upload", formDataImagem);
      const urlImagem = `http://localhost:5000/api/imagens/${response.data.nome}`;
      setPacote(prevState => ({ ...prevState, imagemUrl: urlImagem }));
      setSuccess("Imagem enviada com sucesso!");
    } catch (err) {
      console.log(err);
      setError("Erro ao enviar imagem.");
    }
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setSuccess('');
  setCamposComErro([]); // limpa erros anteriores

  const camposComErroTemp = [];

  // Verifica campos obrigatórios
  for (const key in pacote) {
    if (pacote[key] === '' && key !== 'id_pacote') {
      camposComErroTemp.push(key);
    }
  }

  // Verifica valor
  if (parseFloat(pacote.valor) <= 0) {
    camposComErroTemp.push('valor');
  }

  // Se houver erros, exibe mensagem e aplica estilos
  if (camposComErroTemp.length > 0) {
    setCamposComErro(camposComErroTemp);
    setError('Todos os campos são obrigatórios e o valor deve ser maior que zero.');
    return;
  }

  try {
    if (isEditing) {
      await atualizarPacote(id, pacote);
      setSuccess('Pacote atualizado com sucesso! Redirecionando...');
    } else {
      await cadastrarPacote(pacote);
      setSuccess('Pacote cadastrado com sucesso! Redirecionando...');
    }

    setTimeout(() => {
      navigate('/admin/pacotes');
    }, 2000);

  } catch (err) {
    if (err.response && err.response.data) {
      const { message, errors } = err.response.data;
      const mensagens = Object.values(errors || {}).flat();
      const mensagemFinal = mensagens.length > 0 ? mensagens[0] : message;

      setError(mensagemFinal);

      // Exemplo: se for erro de datas, destaca os campos
      const camposErroDetectados = [];
      if (mensagemFinal.toLowerCase().includes('data')) {
        camposErroDetectados.push('dataInicio', 'dataFim');
      }
      if (mensagemFinal.toLowerCase().includes('valor')) {
        camposErroDetectados.push('valor');
      }

      setCamposComErro(camposErroDetectados);
    } else {
      setError('Erro inesperado ao processar o pacote.');
    }
  }
};


  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="cadastro-pacote-container">
      <div className="form-column">
        <h1 className="form-title">{isEditing ? 'Editar Pacote' : 'Cadastro de Novo Pacote'}</h1>
        <form onSubmit={handleSubmit} className="pacote-form">
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
              <input
  type="number"
  name="valor"
  value={pacote.valor}
  onChange={handleChange}
  placeholder="Ex: 1500.00"
  step="0.01"
  className={camposComErro.includes('valor') ? 'input-error' : ''}
/>

            </div>
          </div>
          <div className="form-group-inline">
            <div className="form-group">
              <label><FaCalendarAlt /> Data de Início</label>
              <input
  type="date"
  name="dataInicio"
  value={pacote.dataInicio}
  onChange={handleChange}
  className={camposComErro.includes('dataInicio') ? 'input-error' : ''}
/>

            </div>
            <div className="form-group">
              <label><FaCalendarAlt /> Data de Fim</label>
              <input
  type="date"
  name="dataFim"
  value={pacote.dataFim}
  onChange={handleChange}
  className={camposComErro.includes('dataFim') ? 'input-error' : ''}
/>

            </div>
          </div>
          <div className="form-group">
            <label><FaImage /> Imagem do Pacote*</label>
            <input
              type="file"
              id="imagemUpload"
              accept="image/*"
              onChange={handleImageUpload}
            />
          </div>
          
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <button type="submit" className="submit-button">
            {isEditing ? 'Salvar Alterações' : 'Cadastrar Pacote'}
          </button>
        </form>
      </div>
      
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
            <p className={`package-price-preview ${parseFloat(pacote.valor) <= 0 ? 'input-error' : ''}`}>
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