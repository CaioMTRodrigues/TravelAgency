import React from 'react';
import Slider from 'react-slick';
import { Link } from 'react-router-dom';

// Criei este componente para ser a fileira de carrossel de um tema específico.
// Ele recebe o título, o ícone e a lista de destinos daquele tema.
const DestinationCarousel = ({ title, icon, destinations = [] }) => {
  // Estas são as configurações do meu carrossel (quantos cards mostrar, etc.)
  const settings = {
    dots: false, // Não mostra os pontinhos de navegação
    arrows: true, // Habilita as setas de navegação
    infinite: false, // O carrossel não volta ao início quando chega no fim
    speed: 500,
    slidesToShow: 4, // Mostra 4 cards por vez em telas grandes
    slidesToScroll: 1,
    // Setas personalizadas com classes CSS
    nextArrow: <div className="custom-arrow custom-arrow-next">›</div>,
    prevArrow: <div className="custom-arrow custom-arrow-prev">‹</div>,
    // A parte 'responsive' ajusta quantos slides aparecem em telas menores.
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className="destination-carousel-row">
      <div className="destination-row-header">
        {icon}
        <h2>{title}</h2>
      </div>
      {/* O componente 'Slider' da biblioteca 'react-slick' cria o carrossel. */}
      <Slider {...settings}>
        {/*
          Eu uso o '.map()' para percorrer a lista de destinos.
          Para cada 'dest' (destino), eu crio um card clicável.
        */}
        {destinations.map(dest => (
          // O 'Link' faz com que o card inteiro leve para a página de detalhes do pacote.
          <Link to={`/pacotes/${dest.id}`} key={dest.id} className="destination-card-wrapper">
            <div className="destination-card">
              <img src={dest.imagem} alt={dest.nome} />
              <div className="destination-card-overlay">
                <h3>{dest.nome}</h3>
                <p>{dest.descricao}</p>
              </div>
            </div>
          </Link>
        ))}
      </Slider>
    </section>
  );
};

export default DestinationCarousel;