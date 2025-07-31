import React from 'react';
// Eu importo os ícones que vou usar diretamente da biblioteca 'react-icons'.
import { FaGlobeAmericas, FaMapMarkerAlt, FaTags } from 'react-icons/fa';

// Este é o meu componente para a barra de navegação com ícones
// que fica logo abaixo do cabeçalho principal.
const IconNav = () => {
  return (
    <nav className="icon-nav">
      {/* Cada item é um link que leva para uma página específica. */}
      <a href="/pacotes" className="icon-nav-item">
        <FaGlobeAmericas size={28} />
        <span>Pacotes</span>
      </a>
      <a href="/destinos" className="icon-nav-item">
        <FaMapMarkerAlt size={28} />
        <span>Principais Destinos</span>
      </a>
      <a href="/ofertas" className="icon-nav-item">
        <FaTags size={28} />
        <span>Melhores Ofertas</span>
      </a>
    </nav>
  );
};

export default IconNav;