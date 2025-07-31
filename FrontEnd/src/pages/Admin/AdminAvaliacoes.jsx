import React, { useEffect, useState } from "react";

// Este é o meu painel administrativo para gerenciar as avaliações dos clientes.
const AdminAvaliacoes = () => {
  // Eu uso este estado para armazenar a lista de avaliações que vem da API.
  const [avaliacoes, setAvaliacoes] = useState([]);

  // O 'useEffect' busca os dados das avaliações assim que a página carrega.
  // A lista de dependências '[]' faz com que ele rode apenas uma vez.
  useEffect(() => {
    // Por enquanto, estou buscando de um arquivo .json local,
    // mas no futuro, trocarei pela URL da minha API real.
    fetch("/api/adminavaliacoes.json")
      .then((res) => res.json())
      .then((data) => setAvaliacoes(data));
  }, []);

  // Criei esta função para excluir uma avaliação.
  // Ela recebe o 'index' (a posição na lista) da avaliação que eu quero remover.
  const excluirAvaliacao = (index) => {
    // Eu mostro uma janela de confirmação para evitar exclusões acidentais.
    const confirmacao = window.confirm("Deseja realmente excluir esta avaliação?");
    
    // Se o administrador confirmar...
    if (confirmacao) {
      // Eu uso o '.filter()' para criar uma nova lista de avaliações,
      // mantendo apenas os itens que NÃO têm o 'index' que eu quero excluir.
      const atualizadas = avaliacoes.filter((_, i) => i !== index);
      // E então, eu atualizo o estado com a nova lista, que não contém a avaliação excluída.
      setAvaliacoes(atualizadas);
    }
  };

  return (
    <div className="admin-avaliacoes">
      <h2>Gerenciamento de Avaliações</h2>
      <table>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Comentário</th>
            <th>Nota</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {/*
            Aqui eu uso o '.map()' para percorrer a lista de avaliações.
            Para cada 'item' na lista, eu crio uma nova linha '<tr>' na tabela.
          */}
          {avaliacoes.map((item, index) => (
            <tr key={index}>
              <td>{item.nome}</td>
              <td>{item.comentario}</td>
              <td>{item.nota}/5</td>
              <td>
                <button onClick={() => excluirAvaliacao(index)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminAvaliacoes;