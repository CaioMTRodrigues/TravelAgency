import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import { isAuthenticated, getUserRole } from '../utils/authGuard';
import { logout } from '../services/authService';
import IconNav from './IconNav'; // Importamos o IconNav para usá-lo aqui dentro
import '../assets/styles/styles.css'; 
import { FaUserCircle } from 'react-icons/fa';

const Header = ({ onLoginClick, onRegisterClick }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());
  const [userRole, setUserRole] = useState(getUserRole());
  const navigate = useNavigate();
  const location = useLocation(); // Hook para saber a página atual

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleAuthChange = () => {
      setIsLoggedIn(isAuthenticated());
      setUserRole(getUserRole());
    };

    window.addEventListener('authChange', handleAuthChange);
    return () => {
      window.removeEventListener('authChange', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    logout();
    window.dispatchEvent(new Event('authChange'));
    navigate('/');
  };

  return (
    // Usamos um Fragment <> para agrupar o Header e o IconNav condicional
    <>
      <header className="menu">
        <div className="menu-container">
          <div className="menu-left">
            <Link to="/" className="header-logo-link">
              <img src={logo} alt="Travel Agency Logo" className="header-logo" />
            </Link>
          </div>

          {/* Renderiza os links de texto apenas se NÃO for a HomePage */}
          {!isHomePage && (
            <nav className="menu-center">
              <Link to="/destinos">Destinos</Link>
              <Link to="/pacotes">Pacotes</Link>
              <Link to="/ofertas">Ofertas</Link>
              {isLoggedIn && userRole === 'User' && <Link to="/minhas-reservas">Minhas Reservas</Link>}
              {isLoggedIn && userRole === 'Admin' && <Link to="/admin">Painel Admin</Link>}
            </nav>
          )}

          <div className="menu-right">
            {isLoggedIn ? (
              // Menu dropdown para utilizador logado
              <div className="dropdown-menu-container">
                <FaUserCircle size={32} style={{ color: 'white', cursor: 'pointer' }} />
                <div className="dropdown-content">
                  <Link to={userRole === 'Admin' ? '/admin' : '/minhas-reservas'}>Meu Painel</Link>
                  <button onClick={handleLogout} className="dropdown-button-link">Sair</button>
                </div>
              </div>
            ) : (
              // Botões para utilizador não logado
              <div className="auth-buttons-container">
                <button className="btn-login" onClick={onLoginClick}>Entrar</button>
                <button className="btn-register" onClick={onRegisterClick}>Cadastrar-se</button>
              </div>
            )}
          </div>
        </div>
      </header>
      
      {/* **CORREÇÃO PRINCIPAL**
        O IconNav é renderizado aqui, mas apenas se estivermos na HomePage
        e o utilizador NÃO estiver logado.
      */}
      {isHomePage && !isLoggedIn && <IconNav />}
    </>
  );
};

export default Header;