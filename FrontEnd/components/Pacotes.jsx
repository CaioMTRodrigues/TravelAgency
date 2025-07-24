import React, { useEffect, useState } from "react";

const Pacotes = () => {
  const [pacotes, setPacotes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulação de fetch para API
  useEffect(() => {
    fetch("/api/pacotes.json") // Pode trocar pela URL real depois
      .then((res) => res.json())
      .then((data) => {
        setPacotes(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Carregando pacotes...</p>;

  return (
    <div className="pacotes-listagem">
      <h2>Pacotes de Viagem</h2>
      <div className="cards">
        {pacotes.map((pacote) => (
          <div key={pacote.id} className="card">
            <img src={pacote.imagem} alt={pacote.titulo} />
            <h3>{pacote.titulo}</h3>
            <p>{pacote.descricao}</p>
            <p>
              <strong>Preço: </strong>R$ {pacote.preco}
            </p>
            <button>Ver Detalhes</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pacotes;