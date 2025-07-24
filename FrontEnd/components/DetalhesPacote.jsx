import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const DetalhesPacote = () => {
  const { id } = useParams(); // Pegando o ID da URL
  const [pacote, setPacote] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/pacotes.json") // Mesmo JSON da listagem
      .then((res) => res.json())
      .then((data) => {
        const pacoteSelecionado = data.find((p) => p.id.toString() === id);
        setPacote(pacoteSelecionado);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Carregando detalhes...</p>;

  if (!pacote) return <p>Pacote não encontrado.</p>;

  return (
    <div className="detalhes-container">
      <h2>{pacote.titulo}</h2>
      <img src={pacote.imagem} alt={pacote.titulo} />
      <p>{pacote.descricao}</p>
      <p><strong>Valor: </strong>R$ {pacote.preco}</p>
      <p><strong>Destino: </strong>{pacote.titulo}</p>
      <p><strong>Datas Disponíveis: </strong>Em breve via API</p>
      <button>Reservar agora</button>
    </div>
  );
};

export default DetalhesPacote;