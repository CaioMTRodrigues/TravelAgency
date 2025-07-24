
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./components/HomePage";
import Login from "./components/Login";
import Cadastro from "./components/Cadastro";
import Pacotes from "./components/Pacotes";
import DetalhesPacote from "./components/DetalhesPacote";
import CentralAjuda from "./components/CentralAjuda";
import MinhasReservas from "./components/MinhasReservas";
import AvaliacoesClientes from "./components/AvaliacoesClientes";
import AdminDashboard from "./components/AdminDashboard";
import AdminPacotes from "./components/AdminPacotes";
import AdminReservas from "./components/AdminReservas";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/pacotes" element={<Pacotes />} />
        <Route path="/pacotes/:id" element={<DetalhesPacote />} />
        <Route path="/ajuda" element={<CentralAjuda />} />
        <Route path="/minhas-reservas" element={<MinhasReservas />} />
        <Route path="/avaliacoes" element={<AvaliacoesClientes />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/pacotes" element={<AdminPacotes />} />
        <Route path="/admin/reservas" element={<AdminReservas />} />
      </Routes>
    </Router>
  );
}

export default App;


