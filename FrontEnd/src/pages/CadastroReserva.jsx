// src/pages/CadastroReserva.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { listarPacotes } from "../services/pacoteService";
import { cadastrarReserva } from "../services/reservaService"; // você vai criar esse
import "./CadastroReserva.css"; // opcional para estilização

const CadastroReserva = () => {
  const [pacotes, setPacotes] = useState([]);
  const [idPacote, setIdPacote] = useState("");
  const [dataReserva, setDataReserva] = useState(new Date().toISOString().slice(0, 10));
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const idUsuario = localStorage.getItem("idUsuario"); // ou use contexto/autenticação

  useEffect(() => {
    const fetchPacotes = async () => {
      try {
        const dados = await listarPacotes();
        setPacotes(dados);
      } catch (err) {
        setErro("Erro ao carregar pacotes.");
      }
    };
    fetchPacotes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await cadastrarReserva({
        id_Usuario: idUsuario,
        id_Pacote: parseInt(idPacote),
        data_Reserva: dataReserva,
      });
      navigate("/minhas-reservas");
    } catch (err) {
      setErro(err.message || "Erro ao cadastrar reserva.");
    }
  };

  return (
    <div className="cadastro-reserva">
      <h2>Nova Reserva</h2>
      {erro && <p className="erro">{erro}</p>}
      <form onSubmit={handleSubmit}>
        <label>Pacote:</label>
        <select value={idPacote} onChange={(e) => setIdPacote(e.target.value)} required>
          <option value="">Selecione um pacote</option>
          {pacotes.map((p) => (
            <option key={p.id_Pacote} value={p.id_Pacote}>
              {p.titulo} - {p.destino}
            </option>
          ))}
        </select>

        <label>Data da Reserva:</label>
        <input
          type="date"
          value={dataReserva}
          onChange={(e) => setDataReserva(e.target.value)}
          required
        />

        <button type="submit">Confirmar Reserva</button>
      </form>
    </div>
  );
};

export default CadastroReserva;
