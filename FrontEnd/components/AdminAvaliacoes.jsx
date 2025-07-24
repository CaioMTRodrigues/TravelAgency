import React, { useEffect, useState } from "react";

const AdminAvaliacoes = () => {
  const [avaliacoes, setAvaliacoes] = useState([]);

  useEffect(() => {
    fetch("/api/adminavaliacoes.json")
      .then((res) => res.json())
      .then((data) => setAvaliacoes(data));
  }, []);

  const excluirAvaliacao = (index) => {
    const confirmacao = window.confirm("Deseja excluir esta avaliação?");
    if (confirmacao) {
      const atualizadas = avaliacoes.filter((_, i) => i !== index);
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