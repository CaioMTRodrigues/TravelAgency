import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // Eu importo o 'useParams' para pegar o ID do pacote da URL.

// Este é o meu componente para mostrar os detalhes de um único pacote.
const DetalhesPacote = () => {
  // O 'useParams' me dá acesso aos parâmetros da URL.
  // Neste caso, eu pego o 'id' do pacote (ex: /pacotes/3).
  const { id } = useParams();

  // Eu uso um estado para guardar as informações do pacote que vou buscar.
  // Ele começa como 'null', porque ainda não tenho os dados.
  const [pacote, setPacote] = useState(null);
  
  // Um estado para controlar a mensagem de "carregando...".
  const [loading, setLoading] = useState(true);

  // O 'useEffect' é perfeito para buscar os dados do pacote quando a página carrega.
  // Ele roda sempre que o 'id' da URL muda.
  useEffect(() => {
    // Por enquanto, estou buscando os dados de um arquivo .json local.
    // No futuro, aqui será uma chamada para a minha API, algo como `/api/pacotes/${id}`.
    fetch("/api/pacotes.json")
      .then((res) => res.json())
      .then((data) => {
        // Depois de buscar todos os pacotes, eu uso o '.find()' para encontrar
        // aquele cujo 'id' é igual ao 'id' que peguei da URL.
        const pacoteSelecionado = data.find((p) => p.id.toString() === id);
        // Eu guardo o pacote encontrado no meu estado.
        setPacote(pacoteSelecionado);
        // E desativo a mensagem de "carregando".
        setLoading(false);
      })
      .catch(() => setLoading(false)); // Também desativo o loading se der erro.
  }, [id]); // A dependência [id] faz o 'useEffect' rodar de novo se o ID na URL mudar.

  // Enquanto os dados estão sendo buscados, eu mostro uma mensagem de carregamento.
  if (loading) return <p>Carregando detalhes...</p>;

  // Se, após a busca, nenhum pacote for encontrado, eu mostro uma mensagem de erro.
  if (!pacote) return <p>Pacote não encontrado.</p>;

  // Se tudo deu certo, eu exibo os detalhes do pacote.
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