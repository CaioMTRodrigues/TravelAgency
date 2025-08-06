import React from 'react';

// Componentes da HomePage
import AjudaFlutuante from '../components/AjudaFlutuante';
import BannerCarousel from '../components/BannerCarousel';
import FeaturedPackages from '../components/FeaturedPackages';
import FiltroPacotes from "../components/FiltroPacotes";

// Importa o arquivo de estilos principal
import "./../assets/styles/styles.css";

// Este é o componente da página inicial.
const HomePage = () => {
  // A lógica de verificação de login foi centralizada no App.js,
  // então este componente agora é apenas para exibição.
  return (
    <>
      {/*
        O componente Header já tem a lógica para decidir se mostra
        o IconNav ou não, então não precisamos mais nos preocupar com isso aqui.
      */}
      
      <div className="banner-container">
        <BannerCarousel />
      </div>
      
      <FeaturedPackages />
      
      {/* O <FiltroPacotes /> foi removido desta seção */}
      
      <AjudaFlutuante />
    </>
  );
};

export default HomePage;