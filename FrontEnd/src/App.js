import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./assets/styles/App.css";

// Componentes
import Header from "./components/Header";
import Footer from "./components/Footer";
import AdminRoute from "./components/AdminRoute";
import Modal from "./components/Modal";
import AuthModal from "./components/AuthModal";
import FormasPagamento from "./components/FormasPagamento";
import ProtectedRoute from "./components/ProtectedRoute";

// Páginas
import HomePage from "./pages/HomePage";
import Pacotes from "./pages/Pacotes";
import DetalhesPacote from "./pages/DetalhesPacote";
import Destinos from "./pages/Destinos";
import Ofertas from "./pages/Ofertas";
import CentralAjuda from "./pages/CentralAjuda";
import AvaliacoesClientes from "./pages/avaliacoesClientes";
import Quiz from "./pages/Quiz";
import Cadastro from "./pages/Cadastro";
import Login from "./pages/Login";
import EsqueciSenha from "./pages/EsqueciSenha";
import RedefinirSenha from "./pages/RedefinirSenha";
import MinhasReservas from "./pages/MinhasReservas";
import CadastroReserva from "./pages/CadastroReserva";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminPacotes from "./pages/Admin/AdminPacotes";
import CadastroPacote from "./pages/Admin/CadastroPacote";
import AdminReservas from "./pages/Admin/AdminReservas";
import AdminAvaliacoes from "./pages/Admin/AdminAvaliacoes";

// --- NOVAS PÁGINAS IMPORTADAS ---
import SobreNos from "./pages/SobreNos";
import TermosServico from "./pages/TermosServico";
import PoliticaPrivacidade from "./pages/PoliticaPrivacidade";
import EscolherFormaPagamento from "./pages/EscolherFormaPagamento";

// Componente Wrapper para passar o estado do modal ao Header
const AppContent = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalView, setModalView] = useState("login");

  const openModal = (view) => {
    setModalView(view);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  return (
    <div className="App">
      <Header
        onLoginClick={() => openModal("login")}
        onRegisterClick={() => openModal("register")}
      />
      <main>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<HomePage />} />
          <Route path="/pacotes" element={<Pacotes />} />
          <Route path="/pacotes/:id" element={<DetalhesPacote openModal={openModal} />} />
          <Route path="/destinos" element={<Destinos />} />
          <Route path="/ofertas" element={<Ofertas />} />
          <Route path="/central-ajuda" element={<CentralAjuda />} />
          <Route path="/avaliacoes" element={<AvaliacoesClientes />} />
          <Route path="/quiz" element={<Quiz />} />

          {/* --- NOVAS ROTAS ADICIONADAS --- */}
          <Route path="/sobre-nos" element={<SobreNos />} />
          <Route path="/termos-servico" element={<TermosServico />} />
          <Route
            path="/politica-privacidade"
            element={<PoliticaPrivacidade />}
          />

          {/* Rotas de Autenticação */}
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/esqueci-senha" element={<EsqueciSenha />} />
          <Route path="/redefinir-senha" element={<RedefinirSenha />} />

          {/* Rotas de Usuário Logado */}
          <Route
            path="/minhas-reservas"
            element={
              <ProtectedRoute>
                <MinhasReservas />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reservar/:id"
            element={
              <ProtectedRoute>
                <CadastroReserva />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pagamento/:idReserva"
            element={
              <ProtectedRoute>
                <EscolherFormaPagamento />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pagamento/:idReserva"
            element={<EscolherFormaPagamento />}
          />

          {/* Rotas Protegidas para Administradores */}
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
            path="/admin/pacotes/cadastro"
            element={
              <AdminRoute>
                <CadastroPacote />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/pacotes/editar/:id"
            element={
              <AdminRoute>
                <CadastroPacote />
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
        </Routes>
      </main>
      <Footer />
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <AuthModal initialView={modalView} onClose={closeModal} />
      </Modal>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
