import React from 'react';
import FiltroPacotes from '../components/FiltroPacotes';
import './../assets/styles/styles.css'; // Mantenha seus estilos globais
import './Pacotes.css'; // Crie este novo arquivo de CSS

const Pacotes = () => {
  return (
    <div className="packages-page-container">
      {/* SEÇÃO 1: BANNER E TÍTULO */}
      <div className="packages-hero">
        <div className="hero-overlay">
          <h1>Encontre Sua Próxima Aventura</h1>
          <p>Explore todos os nossos destinos e filtre de acordo com seus sonhos.</p>
        </div>
      </div>

      {/* SEÇÃO 2: FILTROS E RESULTADOS (Seu componente existente) */}
      <div className="content-wrap">
        <FiltroPacotes />
      </div>
    </div>
  );
};

export default Pacotes;