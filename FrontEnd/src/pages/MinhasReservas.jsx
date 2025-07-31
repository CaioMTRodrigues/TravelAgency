import React, { useEffect, useState } from "react";

// Este é o meu componente para a página "Minhas Reservas".
// Aqui o cliente logado poderá ver o histórico de viagens que ele comprou.
const MinhasReservas = () => {
  // Eu uso um estado para guardar a lista de reservas que virá da API.
  const [reservas, setReservas] = useState([]);
  // E outro estado para controlar a mensagem de "carregando..." enquanto os dados não chegam.
  const [loading, setLoading] = useState(true);

  // O 'useEffect' é ideal para buscar os dados assim que a página é carregada.
  useEffect(() => {
    // No futuro, aqui será uma chamada para a minha API real,
    // que vai retornar apenas as reservas do cliente que está logado.
    fetch("/api/reservas.json")
      .then((res) => res.json())
      .then((data) => {
        setReservas(data); // Guardo os dados no estado.
        setLoading(false); // Escondo a mensagem de "carregando".
      })
      .catch(() => setLoading(false)); // Também escondo se der algum erro.
  }, []); // A lista de dependências '[]' garante que isso rode só uma vez.

  // Enquanto 'loading' for verdadeiro, eu mostro esta mensagem.
  if (loading) return <p>Carregando suas reservas...</p>;

  // Se, após o carregamento, a lista de reservas estiver vazia, eu mostro outra mensagem.
  if (reservas.length === 0) return <p>Você ainda não possui nenhuma reserva.</p>;

  // Se tudo deu certo e existem reservas, eu mostro a lista.
  return (
    <div className="minhas-reservas">
      <h2>Minhas Reservas</h2>
      <ul>
        {/*
          Aqui eu uso o '.map()' para percorrer a lista de reservas.
          Para cada 'reserva', eu crio um item de lista '<li>' com os detalhes dela.
        */}
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