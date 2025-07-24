import React, { useEffect, useState } from "react";

const MinhasReservas = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulação de carregamento de reservas do cliente
    fetch("/api/reservas.json")
      .then((res) => res.json())
      .then((data) => {
        setReservas(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p>Carregando reservas...</p>;

  if (reservas.length === 0) return <p>Você ainda não possui reservas.</p>;

  return (
    <div className="minhas-reservas">
      <h2>Minhas Reservas</h2>
      <ul>
        {reservas.map((reserva) => (
          <li key={reserva.id}>
            <img src={reserva.imagem} alt={reserva.destino} />
            <div>
              <h3>{reserva.destino}</h3>
              <p>Data: {reserva.data}</p>
              <p>Valor pago: R$ {reserva.valor}</p>
              <p>Status: {reserva.status}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MinhasReservas;