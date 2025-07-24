import React, { useEffect, useState } from "react";

const AdminPacotes = () => {
  const [pacotes, setPacotes] = useState([]);

  useEffect(() => {
    fetch("/api/adminpacotes.json")
      .then((res) => res.json())
      .then((data) => setPacotes(data));
  }, []);

  const excluirPacote = (id) => {
    const confirmacao = window.confirm("Deseja realmente excluir este pacote?");
    if (confirmacao) {
      const atualizados = pacotes.filter((p) => p.id !== id);
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
          {pacotes.map((pacote) => (
            <tr key={pacote.id}>
              <td>{pacote.destino}</td>
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