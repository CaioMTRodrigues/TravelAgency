import React, { useEffect, useState } from "react";

// Esta é a minha página para visualizar as reservas feitas pelos clientes.
const AdminReservas = () => {
  // Eu uso este estado para guardar a lista de reservas que vem da API.
  const [reservas, setReservas] = useState([]);

  // Assim que a página carrega, eu uso o 'useEffect' para buscar os dados.
  // A lista de dependências '[]' garante que a busca aconteça só uma vez.
  useEffect(() => {
    // Por enquanto, estou buscando de um arquivo .json local,
    // mas no futuro, trocarei pela URL da minha API real que retorna as reservas.
    fetch("/api/adminreservas.json")
      .then((res) => res.json())
      .then((data) => setReservas(data));
  }, []);

  return (
    <div className="admin-reservas">
      <h2>Gerenciamento de Reservas</h2>
      <table>
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Destino</th>
            <th>Data</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {/*
            Aqui eu uso o '.map()' para percorrer a minha lista de reservas.
            Para cada 'reserva' na lista, eu crio uma nova linha '<tr>' na tabela
            para exibir suas informações.
          */}
          {reservas.map((reserva, index) => (
            <tr key={index}>
              <td>{reserva.cliente}</td>
              <td>{reserva.destino}</td>
              <td>{reserva.data}</td>
              <td>{reserva.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminReservas;