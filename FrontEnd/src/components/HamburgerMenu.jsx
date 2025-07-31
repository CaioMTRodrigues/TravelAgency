import React from 'react';
import { FiMenu } from 'react-icons/fi';
import { FaUserCircle, FaQuestionCircle } from 'react-icons/fa';

// Este é o meu componente para o menu retrátil (hambúrguer).
// Eu passo a função 'onLoginClick' para ele a partir da página principal.
// Isso permite que o botão de login dentro do menu consiga abrir o modal
// que está na página Home, por exemplo.
const HamburgerMenu = ({ onLoginClick }) => {
  return (
    <div className="hamburger-menu">
      {/* O ícone de três traços que o usuário vê. */}
      <FiMenu className="hamburger-icon" size={28} />
      
      {/* Este é o menu que fica escondido e só aparece quando passo o mouse. */}
      <div className="dropdown-menu">
        {/*
          Em vez de um link, eu uso um botão para o login.
          Quando eu clico nele, ele executa a função 'onLoginClick'
          que foi passada para este componente, abrindo o modal.
        */}
        <button onClick={onLoginClick} className="dropdown-button-link">
          <FaUserCircle />
          <span>Entre ou Cadastre-se</span>
        </button>
        
        {/* Este é um link normal que leva para a página de ajuda. */}
        <a href="/ajuda">
          <FaQuestionCircle />
          <span>Central de Ajuda</span>
        </a>
      </div>
    </div>
  );
};

export default HamburgerMenu;