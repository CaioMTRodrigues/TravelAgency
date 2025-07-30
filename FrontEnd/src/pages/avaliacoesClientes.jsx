import React, { useEffect, useState } from "react";

// Criei este componente para mostrar todas as avaliações que os clientes deixaram.
// É uma página importante para gerar confiança em novos visitantes.
const AvaliacoesClientes = () => {
  // Este estado vai guardar a lista de todas as avaliações que eu buscar da API.
  const [avaliacoes, setAvaliacoes] = useState([]);

  // Eu uso o 'useEffect' para buscar os dados assim que a página é carregada.
  // A lista de dependências '[]' faz com que ele rode apenas uma vez.
  useEffect(() => {
    // No futuro, aqui será a URL da minha API real.
    // Por enquanto, estou usando um arquivo .json local para simular os dados.
    fetch("/api/avaliacoes.json")
      .then((res) => res.json())
      .then((data) => setAvaliacoes(data))
      .catch((err) => console.error("Erro ao carregar avaliações", err));
  }, []);

  return (
    <div className="avaliacoes">
      <h2>Avaliações de Clientes</h2>
      <div className="lista-avaliacoes">
        {/*
          Aqui eu uso o '.map()' para percorrer a minha lista de avaliações.
          Para cada 'avaliacao' na lista, eu crio um "card" com as informações dela.
        */}
        {avaliacoes.map((avaliacao, index) => (
          <div key={index} className="card-avaliacao">
            <h3>{avaliacao.nome}</h3>
            {/* Um truque legal para mostrar as estrelas:
              Eu crio a string "⭐" e a repito o número de vezes
              correspondente à nota da avaliação.
            */}
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