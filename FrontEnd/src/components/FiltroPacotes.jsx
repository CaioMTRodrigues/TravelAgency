import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// CORREÇÃO: A função foi renomeada para 'listarTodosPacotes'.
import { listarTodosPacotes } from "../services/pacoteService";
import "./FiltroPacotes.css";
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaTag } from "react-icons/fa";

const FiltroPacotes = () => {
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
        // CORREÇÃO: Usando a função correta que foi importada.
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

  return (
    <section className="filtro-pacotes">
      <h2>Buscar Pacotes</h2>

      <div className="filtros">
        <input
          type="text"
          placeholder="Destino..."
          value={filtroDestino}
          onChange={(e) => setFiltroDestino(e.target.value)}
        />
        <input
          type="number"
          placeholder="Preço mínimo..."
          value={filtroPrecoMin}
          onChange={(e) => setFiltroPrecoMin(e.target.value)}
        />
        <input
          type="number"
          placeholder="Preço máximo..."
          value={filtroPrecoMax}
          onChange={(e) => setFiltroPrecoMax(e.target.value)}
        />
      </div>

      {erro && <p className="error-message">{erro}</p>}
      {erroFiltro && <p className="error-message">{erroFiltro}</p>}

      {pacotesFiltrados.length === 0 && !erroFiltro ? (
        <p>Nenhum pacote encontrado com os filtros selecionados.</p>
      ) : (
        <div className="pacotes-grid">
          {pacotesFiltrados.map((pacote) => (
            <div key={pacote.id_Pacote} className="package-card">
              <img src={pacote.imagemUrl} alt={pacote.titulo} />
              <h3>{pacote.titulo}</h3>
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
              <button onClick={() => navigate(`/pacotes/${pacote.id_Pacote}`)}>
                Ver detalhes
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default FiltroPacotes;