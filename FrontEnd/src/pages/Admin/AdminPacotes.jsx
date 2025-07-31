import React, { useEffect, useState } from "react";

// Esta é a minha página para gerenciar os pacotes de viagem no painel de administração.
const AdminPacotes = () => {
  // Eu uso este estado para guardar a lista de pacotes que vem da API.
  const [pacotes, setPacotes] = useState([]);

  // Assim que a página carrega, eu uso o 'useEffect' para buscar os dados dos pacotes.
  // A lista de dependências '[]' faz com que isso aconteça só uma vez.
  useEffect(() => {
    // No futuro, aqui será a URL da minha API real. Por enquanto, uso um arquivo local.
    fetch("/api/adminpacotes.json")
      .then((res) => res.json())
      .then((data) => setPacotes(data));
  }, []);

  // Criei esta função para excluir um pacote. Ela recebe o 'id' do pacote a ser removido.
  const excluirPacote = (id) => {
    // Eu sempre peço uma confirmação para evitar cliques acidentais.
    const confirmacao = window.confirm("Deseja realmente excluir este pacote?");
    
    // Se o administrador confirmar...
    if (confirmacao) {
      // Eu crio uma nova lista de pacotes, filtrando e removendo aquele com o 'id' correspondente.
      const atualizados = pacotes.filter((p) => p.id !== id);
      // Atualizo o estado com a nova lista, o que faz a tela ser redesenhada sem o pacote excluído.
      setPacotes(atualizados);
      alert("Pacote excluído com sucesso!");
    }
  };

  return (
    <div className="admin-pacotes">
      <h2>Gerenciamento de Pacotes</h2>
      <table>
        <thead>
          <tr>
            <th>Destino</th>
            <th>Preço</th>
            <th>Duração</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {/*
            Aqui eu uso o '.map()' para percorrer a minha lista de pacotes.
            Para cada 'pacote' na lista, eu crio uma linha '<tr>' na tabela.
          */}
          {pacotes.map((pacote) => (
            <tr key={pacote.id}>
              <td>{pacote.destino}</td>
              {/* Uso .toFixed(2) para garantir que o preço sempre tenha duas casas decimais. */}
              <td>R$ {pacote.preco.toFixed(2)}</td>
              <td>{pacote.duracao}</td>
              <td>
                <button onClick={() => excluirPacote(pacote.id)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPacotes;