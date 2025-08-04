import React from 'react';

// Componentes da HomePage
import AjudaFlutuante from '../components/AjudaFlutuante';
import BannerCarousel from '../components/BannerCarousel';
import FeaturedPackages from '../components/FeaturedPackages';
// A importação do IconNav e do isAuthenticated foi removida daqui.

import "./../assets/styles/styles.css";

const HomePage = () => {
  // Toda a lógica de verificação de login foi removida.
  // O componente agora é responsável apenas por renderizar o conteúdo da página.
  return (
    <>
      {/* A chamada para <IconNav /> foi completamente REMOVIDA daqui.
          O componente Header agora é o único responsável por esta lógica. */}
      
      <div className="banner-container">
        <BannerCarousel />
      </div>
      <FeaturedPackages />
      <AjudaFlutuante />
    </>
  );
};

export default HomePage;
