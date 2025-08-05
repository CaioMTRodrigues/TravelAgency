import React from 'react';
import Slider from 'react-slick';

// Primeiro, eu importo todas as imagens que quero usar no carrossel.
// Fazer isso garante que o React otimize as imagens e que elas sempre funcionem.
import bannerImg1 from '../assets/images/Banner1.png';
import bannerImg2 from '../assets/images/Banner2.png';
import bannerImg3 from '../assets/images/Banner3.png';
import bannerImg4 from '../assets/images/Banner4.png';
import bannerImg5 from '../assets/images/Banner5.png';

// Este é o meu componente para o carrossel de banners da página inicial.
const BannerCarousel = () => {
  // Aqui eu defino todas as configurações do carrossel.
  // Por exemplo, 'dots: true' mostra os pontinhos de navegação,
  // e 'autoplay: true' faz ele passar as imagens sozinho.
  const settings = {
    dots: true,
    arrows: true, // Habilita as setas de navegação
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000, // 5 segundos por imagem
    fade: true,
    cssEase: 'linear',
    // Setas personalizadas com classes CSS
    nextArrow: <div className="custom-arrow custom-arrow-next">›</div>,
    prevArrow: <div className="custom-arrow custom-arrow-prev">‹</div>,
  };

  // Criei uma lista (array) com as imagens que importei lá em cima.
  // Fica mais organizado e fácil de usar no código abaixo.
  const images = [
    bannerImg1,
    bannerImg2,
    bannerImg3,
    bannerImg4,
    bannerImg5
  ];

  return (
    <div className="banner-carousel">
      {/* O componente 'Slider' da biblioteca react-slick cria o carrossel.
        Eu passo as minhas configurações para ele com a sintaxe '{...settings}'.
      */}
      <Slider {...settings}>
        {/*
          Aqui eu uso a função '.map()' para percorrer a minha lista de imagens.
          Para cada imagem na lista, eu crio uma div com a imagem dentro.
          O 'key={index}' é uma exigência do React para identificar cada item da lista.
        */}
        {images.map((img, index) => (
          <div key={index}>
            <img src={img} alt={`Banner ${index + 1}`} style={{ width: '100%', height: '450px', objectFit: 'cover' }} />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default BannerCarousel;