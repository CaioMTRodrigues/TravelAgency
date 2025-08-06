import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listarTodosPacotes } from "../services/pacoteService";
import "./FiltroPacotes.css";
// Importando todos os ícones necessários
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaTag, FaSearch, FaDollarSign } from "react-icons/fa";

const FiltroPacotes = () => {
  // --- TODA A SUA LÓGICA DE ESTADO E EFEITOS PERMANECE INTOCADA ---
  const [pacotes, setPacotes] = useState([]);
  const [filtroDestino, setFiltroDestino] = useState("");
  const [filtroPrecoMin, setFiltroPrecoMin] = useState("");
  const [filtroPrecoMax, setFiltroPrecoMax] = useState("");
  const [erro, setErro] = useState("");
  const [erroFiltro, setErroFiltro] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPacotes = async () => {
      try {
        const dados = await listarTodosPacotes();
        setPacotes(dados);
      } catch (err) {
        setErro(err.message || "Erro ao carregar pacotes.");
      }
    };

    fetchPacotes();
  }, []);

  useEffect(() => {
    if (
      filtroPrecoMin !== "" &&
      filtroPrecoMax !== "" &&
      parseFloat(filtroPrecoMin) > parseFloat(filtroPrecoMax)
    ) {
      setErroFiltro("O preço mínimo não pode ser maior que o preço máximo.");
    } else {
      setErroFiltro("");
    }
  }, [filtroPrecoMin, filtroPrecoMax]);

  const pacotesFiltrados = pacotes.filter((p) => {
    const destinoMatch =
      filtroDestino === "" ||
      p.destino.toLowerCase().includes(filtroDestino.toLowerCase());
    const precoMinMatch =
      filtroPrecoMin === "" || p.valor >= parseFloat(filtroPrecoMin);
    const precoMaxMatch =
      filtroPrecoMax === "" || p.valor <= parseFloat(filtroPrecoMax);
    return destinoMatch && precoMinMatch && precoMaxMatch;
  });

  // --- O JSX FOI REESTRUTURADO VISUALMENTE ---
  return (
    <section className="filtro-pacotes-container">
      {/* Card de filtros com título e ícones */}
      <div className="filtros-card">
        <h2><FaSearch /> Encontre seu Pacote</h2>
        <div className="filtros-wrapper">
          <div className="filtro-item">
            <label htmlFor="destino">Destino</label>
            <input
              id="destino"
              type="text"
              placeholder="Para onde vamos?"
              value={filtroDestino}
              onChange={(e) => setFiltroDestino(e.target.value)}
            />
          </div>
          <div className="filtro-item">
            <label htmlFor="precoMin"><FaDollarSign /> Preço Mínimo</label>
            <input
              id="precoMin"
              type="number"
              placeholder="R$ 1000"
              value={filtroPrecoMin}
              onChange={(e) => setFiltroPrecoMin(e.target.value)}
            />
          </div>
          <div className="filtro-item">
            <label htmlFor="precoMax"><FaDollarSign /> Preço Máximo</label>
            <input
              id="precoMax"
              type="number"
              placeholder="R$ 5000"
              value={filtroPrecoMax}
              onChange={(e) => setFiltroPrecoMax(e.target.value)}
            />
          </div>
        </div>
        {/* Mensagem de erro para o filtro movida para dentro do card */}
        {erroFiltro && <p className="error-message filtro-error">{erroFiltro}</p>}
      </div>

      {/* Exibição das mensagens de erro e resultados */}
      {erro && <p className="error-message">{erro}</p>}
      
      {pacotesFiltrados.length === 0 && !erroFiltro && !erro ? (
        <p className="nenhum-pacote-encontrado">Nenhum pacote encontrado com os filtros selecionados.</p>
      ) : (
        <div className="pacotes-grid">
          {pacotesFiltrados.map((pacote) => (
            <div key={pacote.id_Pacote} className="package-card">
              <img src={pacote.imagemUrl} alt={pacote.titulo} />
              <div className="package-card-content">
                <h3>{pacote.titulo}</h3>
                <p className="package-description">
                  {/* Mantive a descrição aqui caso queira adicioná-la no futuro */}
                </p>
                <div className="package-info">
                  <p>
                    <FaMapMarkerAlt className="icon" /> {pacote.destino}
                  </p>
                  <p>
                    <FaTag className="icon" /> R${pacote.valor.toFixed(2)}
                  </p>
                  <p>
                    <FaClock className="icon" /> {pacote.duracaoDias} dias
                  </p>
                  <p>
                    <FaCalendarAlt className="icon" />{" "}
                    {new Date(pacote.dataInicio).toLocaleDateString()} -{" "}
                    {new Date(pacote.dataFim).toLocaleDateString()}
                  </p>
                </div>
                <button onClick={() => navigate(`/pacotes/${pacote.id_Pacote}`)}>
                  Ver detalhes
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default FiltroPacotes;