import React from 'react';
import { Link } from 'react-router-dom';
import HamburgerMenu from './HamburgerMenu';

// Eu importo a minha logo diretamente. Assim, o React cuida de otimizar
// e garantir que o caminho para a imagem esteja sempre correto.
import logo from '../assets/images/logo.png'; 

// Este é o meu componente de cabeçalho, que aparecerá em todas as páginas.
// Ele recebe a função 'onLoginClick' para que eu possa abrir o modal de login
// a partir do menu hambúrguer.
const Header = ({ onLoginClick }) => {
  return (
    <header className="menu">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* Eu coloco o meu menu hambúrguer aqui. */}
        <HamburgerMenu onLoginClick={onLoginClick} />
        
        {/*
          O componente 'Link' do react-router-dom cria um link de navegação.
          Eu o uso para envolver a minha logo, fazendo com que, ao clicar nela,
          o usuário seja redirecionado para a página inicial ('/').
        */}
        <Link to="/" className="header-title-link">
          <img src={logo} alt="Travel Agency Logo" className="header-logo" />
        </Link>
      </div>
    </header>
  );
};

export default Header;