import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./assets/styles/App.css";

import HomePage from "./pages/HomePage";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Pacotes from "./pages/Pacotes";
import DetalhesPacote from "./pages/DetalhesPacote";
import CentralAjuda from "./pages/CentralAjuda";
import MinhasReservas from "./pages/MinhasReservas";
import AvaliacoesClientes from "./pages/avaliacoesClientes";
import Destinos from "./pages/Destinos";
import Ofertas from "./pages/Ofertas";
import Quiz from "./pages/Quiz";

import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminPacotes from "./pages/Admin/AdminPacotes";
import AdminReservas from "./pages/Admin/AdminReservas";
import AdminAvaliacoes from "./pages/Admin/AdminAvaliacoes";

import { isAuthenticated } from "./utils/authGuard";

import AdminRoute from "./utils/AdminRoute"; // importe o novo componente
import CadastroPacote from "./pages/Admin/CadastroPacote";
import CadastroReserva from "./pages/CadastroReserva";

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/pacotes" element={<Pacotes />} />
        <Route path="/pacotes/:id" element={<DetalhesPacote />} />
        <Route path="/ajuda" element={<CentralAjuda />} />
        <Route path="/avaliacoes" element={<AvaliacoesClientes />} />
        <Route path="/destinos" element={<Destinos />} />
        <Route path="/ofertas" element={<Ofertas />} />
        <Route path="/quiz" element={<Quiz />} />

        <Route
          path="/reservar"
          element={
            <PrivateRoute>
              <CadastroReserva />
            </PrivateRoute>
          }
        />

        <Route
          path="/minhas-reservas"
          element={
            <PrivateRoute>
              <MinhasReservas />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/pacotes"
          element={
            <AdminRoute>
              <AdminPacotes />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/reservas"
          element={
            <AdminRoute>
              <AdminReservas />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/avaliacoes"
          element={
            <AdminRoute>
              <AdminAvaliacoes />
            </AdminRoute>
          }
        />

        <Route
          path="/admin/cadastrar-pacote"
          element={
            <AdminRoute>
              <CadastroPacote />
            </AdminRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
