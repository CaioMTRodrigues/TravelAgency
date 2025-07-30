import React, { useState, useEffect } from "react";

// Este é o meu painel principal de administração.
// Ele serve como um resumo de tudo que está acontecendo no site.
const AdminDashboard = () => {
  // Eu uso três estados separados para guardar as listas de pacotes, reservas e avaliações.
  const [pacotes, setPacotes] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState([]);

  // O useEffect é perfeito para carregar os dados iniciais quando a página abre.
  // A lista '[]' no final garante que isso aconteça apenas uma vez.
  useEffect(() => {
    // Por enquanto, estou usando dados fixos ("hardcoded") para simular o que viria da API.
    // No futuro, eu vou substituir isso por uma chamada real com 'fetch()'.
    setPacotes([
      { id: 1, destino: "Rio de Janeiro", data: "2025-09-10", preco: 1200 },
      { id: 2, destino: "Natal", data: "2025-10-15", preco: 1500 },
    ]);

    setReservas([
      { id: 101, cliente: "Maria", destino: "Natal", data: "2025-10-15" },
      { id: 102, cliente: "João", destino: "Rio", data: "2025-09-10" },
    ]);

    setAvaliacoes([
      { id: 1, cliente: "Paula", nota: 5, comentario: "Experiência incrível!" },
      { id: 2, cliente: "Carlos", nota: 4, comentario: "Muito bom, recomendo!" },
    ]);
  }, []);

  // Criei funções separadas para excluir cada tipo de item.
  // Elas usam o método '.filter()' para criar uma nova lista sem o item que eu quero remover.
  const excluirPacote = (id) => {
    setPacotes(pacotes.filter((p) => p.id !== id));
  };

  const excluirReserva = (id) => {
    setReservas(reservas.filter((r) => r.id !== id));
  };

  const excluirAvaliacao = (id) => {
    setAvaliacoes(avaliacoes.filter((a) => a.id !== id));
  };

  return (
    <div className="admin-dashboard">
      <h2>Painel do Administrador</h2>
      <p>Bem-vindo, administrador! Abaixo estão os dados mais recentes:</p>

      {/* Seção para gerenciar os pacotes de viagem. */}
      <section>
        <h3>Pacotes de Viagem</h3>
        <table className="tabela-admin">
          <thead>
            <tr>
              <th>ID</th>
              <th>Destino</th>
              <th>Data</th>
              <th>Preço (R$)</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {/* Eu uso o '.map()' para criar uma linha na tabela para cada pacote. */}
            {pacotes.map((pacote) => (
              <tr key={pacote.id}>
                <td>{pacote.id}</td>
                <td>{pacote.destino}</td>
                <td>{pacote.data}</td>
                <td>{pacote.preco}</td>
                <td>
                  <button onClick={() => excluirPacote(pacote.id)}>🗑️ Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Seção para gerenciar as reservas feitas pelos clientes. */}
      <section>
        <h3>Reservas</h3>
        <table className="tabela-admin">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Destino</th>
              <th>Data</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {reservas.map((reserva) => (
              <tr key={reserva.id}>
                <td>{reserva.id}</td>
                <td>{reserva.cliente}</td>
                <td>{reserva.destino}</td>
                <td>{reserva.data}</td>
                <td>
                  <button onClick={() => excluirReserva(reserva.id)}>🗑️ Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Seção para visualizar as avaliações deixadas pelos clientes. */}
      <section>
        <h3>Avaliações dos Clientes</h3>
        <table className="tabela-admin">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Nota</th>
              <th>Comentário</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {avaliacoes.map((avaliacao) => (
              <tr key={avaliacao.id}>
                <td>{avaliacao.id}</td>
                <td>{avaliacao.cliente}</td>
                <td>{avaliacao.nota}</td>
                <td>{avaliacao.comentario}</td>
                <td>
                  <button onClick={() => excluirAvaliacao(avaliacao.id)}>🗑️ Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default AdminDashboard;