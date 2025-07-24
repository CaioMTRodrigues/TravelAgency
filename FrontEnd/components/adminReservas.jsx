import React, { useEffect, useState } from "react";

const AdminReservas = () => {
  const [reservas, setReservas] = useState([]);

  useEffect(() => {
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