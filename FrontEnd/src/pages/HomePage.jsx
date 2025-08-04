import React from 'react';

// Componentes da HomePage
import AjudaFlutuante from '../components/AjudaFlutuante';
import BannerCarousel from '../components/BannerCarousel';
import FeaturedPackages from '../components/FeaturedPackages';
// A importação do IconNav e do isAuthenticated foi removida daqui.

<<<<<<< HEAD
import "./../assets/styles/styles.css";

=======


import FiltroPacotes from "../components/FiltroPacotes";



// E também importo meu arquivo de estilos principal.
import "./../assets/styles/styles.css";


// Este é o componente da minha página inicial, a principal página do site.
>>>>>>> ed5609c3610fdbae2380527195cde0ed1cb397c8
const HomePage = () => {
  // Toda a lógica de verificação de login foi removida.
  // O componente agora é responsável apenas por renderizar o conteúdo da página.
  return (
<<<<<<< HEAD
    <>
      {/* A chamada para <IconNav /> foi completamente REMOVIDA daqui.
          O componente Header agora é o único responsável por esta lógica. */}
      
      <div className="banner-container">
        <BannerCarousel />
      </div>
      <FeaturedPackages />
=======
    // A div 'home' envolve toda a página e é a chave para o layout do rodapé fixo.
    <div className="home">
      {/*
        Eu uso meu componente Header aqui.
        Passo a função 'openModal' para ele, assim o botão de login dentro
        do Header pode controlar o estado que vive aqui na HomePage.
      */}
      <Header onLoginClick={openModal} />

      {/* O 'main' contém todo o conteúdo principal da página. */}
      <main>
        <IconNav />
        <div className="banner-container">
          <BannerCarousel />
        </div>
        <FeaturedPackages />
        
        <FiltroPacotes />
        {/* Aqui eu poderia adicionar mais seções ou componentes, como notícias, promoções, etc. */}
      </main>

      {/* Uso meu componente de rodapé aqui. */}
      <Footer />

      {/* O botão de ajuda flutuante. */}
>>>>>>> ed5609c3610fdbae2380527195cde0ed1cb397c8
      <AjudaFlutuante />
    </>
  );
};

export default HomePage;
