import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Importando estilos globais
import './assets/styles/App.css';

// Importando páginas da nova estrutura
import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Pacotes from "./pages/Pacotes";
import DetalhesPacote from "./pages/DetalhesPacote";
import CentralAjuda from "./pages/CentralAjuda";
import MinhasReservas from "./pages/MinhasReservas";
import AvaliacoesClientes from "./pages/avaliacoesClientes";

// Importando páginas do painel de administração
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminPacotes from "./pages/Admin/AdminPacotes";
import AdminReservas from "./pages/Admin/AdminReservas";
import AdminAvaliacoes from "./pages/Admin/AdminAvaliacoes";

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

        {/* Rotas de Administração */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/pacotes" element={<AdminPacotes />} />
        <Route path="/admin/reservas" element={<AdminReservas />} />
        <Route path="/admin/avaliacoes" element={<AdminAvaliacoes />} />
      </Routes>
    </Router>
  );
}

export default App;