import React from "react";
import { Link } from 'react-router-dom';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./../assets/styles/styles.css";

// Seus dados de exemplo são mantidos exatamente como estavam.
const pacotesNacionais = [
  { id: 1, nome: "Rio de Janeiro", descricao: "Praias, Cristo Redentor e a alegria carioca.", preco: 999, imagem: "https://wallpaperaccess.com/full/125819.jpg" },
  { id: 2, nome: "Gramado", descricao: "O charme da Europa na Serra Gaúcha.", preco: 1299, imagem: "https://gramadoinesquecivel.tur.br/img/gramado/img-gramado-5.jpg" },
  { id: 4, nome: "Fernando de Noronha", descricao: "Mergulhe nas águas cristalinas deste paraíso.", preco: 2500, imagem: "https://a.cdn-hotels.com/gdcs/production55/d458/fc74de3b-0bd1-4284-b53b-be71ba136901.jpg" },
  { id: 5, nome: "Salvador", descricao: "Cultura, história e o axé contagiante da Bahia.", preco: 850, imagem: "https://tse4.mm.bing.net/th/id/OIP.EN61-JMFnY1gZWQz7-KZQgHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" },
];

const pacotesInternacionais = [
  { id: 3, nome: "Paris, França", descricao: "Explore a capital do romance e da cultura.", preco: 4999, imagem: "https://wallpaperaccess.com/full/296525.jpg" },
  { id: 6, nome: "Tóquio, Japão", descricao: "A fusão perfeita entre o tradicional e o futurista.", preco: 6500, imagem: "https://wallpapercave.com/wp/wp8438159.jpg" },
  { id: 7, nome: "Roma, Itália", descricao: "Uma viagem pela história do Império Romano.", preco: 4500, imagem: "https://tse2.mm.bing.net/th/id/OIP.aRz4Gjf4Guxk8iRBfBXFWQHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" },
  { id: 8, nome: "Cancún, México", descricao: "Praias paradisíacas e festas inesquecíveis no Caribe.", preco: 3800, imagem: "https://tse4.mm.bing.net/th/id/OIP.MP9nZk52AVkhmKx2ZcfGyQHaEK?r=0&w=2560&h=1440&rs=1&pid=ImgDetMain&o=7&rm=3" },
];

const Pacotes = () => {
  // A lógica do Modal, Header e Footer foi removida.
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    // O componente agora começa diretamente com o conteúdo da página.
    <div className="packages-page">
      <h1 className="packages-title">Nossos Pacotes de Viagem</h1>
      <p className="packages-subtitle">Descubra o destino dos seus sonhos</p>

      <div className="carousel-section">
        <h2>Destinos Nacionais</h2>
        <Slider {...settings}>
          {pacotesNacionais.map((pacote) => (
            <Link to={`/pacotes/${pacote.id}`} key={pacote.id} className="package-card-wrapper">
              <div className="package-card">
                <img src={pacote.imagem} alt={pacote.nome} className="package-image" />
                <div className="package-details">
                  <h3>{pacote.nome}</h3>
                  <p className="package-description">{pacote.descricao}</p>
                  <p className="package-price">A partir de R$ {pacote.preco}</p>
                  <button className="package-button">Ver Detalhes</button>
                </div>
              </div>
            </Link>
          ))}
        </Slider>
      </div>

      <div className="carousel-section">
        <h2>Destinos Internacionais</h2>
        <Slider {...settings}>
          {pacotesInternacionais.map((pacote) => (
            <Link to={`/pacotes/${pacote.id}`} key={pacote.id} className="package-card-wrapper">
              <div className="package-card">
                <img src={pacote.imagem} alt={pacote.nome} className="package-image" />
                <div className="package-details">
                  <h3>{pacote.nome}</h3>
                  <p className="package-description">{pacote.descricao}</p>
                  <p className="package-price">A partir de R$ {pacote.preco}</p>
                  <button className="package-button">Ver Detalhes</button>
                </div>
              </div>
            </Link>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Pacotes;
