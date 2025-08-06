import React, { useEffect, useState } from "react";
import { buscarViajantesPorNome } from "../services/viajanteService";
import "./ModalViajante.css";

const ModalViajante = ({ idUsuario, onSelecionar, onFechar }) => {
  const [nomeBusca, setNomeBusca] = useState("");
  const [sugestoes, setSugestoes] = useState([]);

  
useEffect(() => {
    const fetchSugestoes = async () => {
      if (nomeBusca.length >= 2) {
        try {
          console.log("Buscando viajantes com nome:", nomeBusca, "e idUsuario:", idUsuario);
          const resultados = await buscarViajantesPorNome(nomeBusca, idUsuario); // ✅ aqui está o idUsuario
          setSugestoes(resultados);
          console.log("Id do suaurio:", idUsuario);
        } catch (err) {
          console.error("Erro ao buscar sugestões:", err);
        }
      } else {
        setSugestoes([]);
      }
    };

    const delay = setTimeout(fetchSugestoes, 300);
    return () => clearTimeout(delay);
  }, [nomeBusca, idUsuario]);


  const handleSelecionarSugestao = (viajante) => {
    onSelecionar(viajante);
    onFechar();
  };

  return (
    <div className="modal">
      <h3>Buscar Viajante</h3>
      <input
        type="text"
        placeholder="Digite o nome"
        value={nomeBusca}
        onChange={(e) => setNomeBusca(e.target.value)}
      />
      {sugestoes.length > 0 && (
        <ul className="sugestoes-list">
          {sugestoes.map((v) => (
            <li key={v.id_Viajante} onClick={() => handleSelecionarSugestao(v)}>
              {v.nome}
            </li>
          ))}
        </ul>
      )}
      <button onClick={onFechar}>Fechar</button>
    </div>
  );
};

export default ModalViajante;
