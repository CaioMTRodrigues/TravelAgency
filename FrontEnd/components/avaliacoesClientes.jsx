import React, { useEffect, useState } from "react";

const AvaliacoesClientes = () => {
  const [avaliacoes, setAvaliacoes] = useState([]);

  useEffect(() => {
    // Simulando carregamento de avaliações
    fetch("/api/avaliacoes.json")
      .then((res) => res.json())
      .then((data) => setAvaliacoes(data))
      .catch((err) => console.error("Erro ao carregar avaliações", err));
  }, []);

  return (
    <div className="avaliacoes">
      <h2>Avaliações de Clientes</h2>
      <div className="lista-avaliacoes">
        {avaliacoes.map((avaliacao, index) => (
          <div key={index} className="card-avaliacao">
            <h3>{avaliacao.nome}</h3>
            <p className="estrelas">{"⭐".repeat(avaliacao.estrelas)}</p>
            <p>{avaliacao.comentario}</p>
            <p className="destino">Destino: {avaliacao.destino}</p>
            <p className="data">Data da viagem: {avaliacao.data}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvaliacoesClientes;