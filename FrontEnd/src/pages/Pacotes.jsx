import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Modal from "../components/Modal";
import AuthModal from "../components/AuthModal";
import Slider from "react-slick"; // Eu importo o componente de Carrossel (Slider).
import "slick-carousel/slick/slick.css"; // E também importo os estilos base dele.
import "slick-carousel/slick/slick-theme.css"; // E os estilos do tema, para os botões e pontos.
import "./../assets/styles/styles.css";

// Para esta página, eu criei duas listas de pacotes de exemplo.
// No futuro, quando eu conectar o backend, vou buscar esses dados de lá.
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

// Este é o meu componente para a página que lista todos os pacotes.
const Pacotes = () => {
  // Eu mantenho a lógica do modal aqui também, para que o Header funcione corretamente.
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Criei um objeto com as configurações dos meus carrosséis.
  // 'infinite: false' significa que o carrossel não volta para o começo ao chegar no fim.
  // A parte 'responsive' é muito legal, pois ajusta quantos slides aparecem
  // dependendo do tamanho da tela do usuário.
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
    <div className="home">
      <Header onLoginClick={openModal} />

      <main className="packages-page">
        <h1 className="packages-title">Nossos Pacotes de Viagem</h1>
        <p className="packages-subtitle">Descubra o destino dos seus sonhos</p>

        {/* Criei uma seção para os Destinos Nacionais. */}
        <div className="carousel-section">
          <h2>Destinos Nacionais</h2>
          {/* O componente 'Slider' cria o carrossel com as minhas configurações. */}
          <Slider {...settings}>
            {/* Eu uso o '.map()' para criar um card para cada pacote da minha lista. */}
            {pacotesNacionais.map((pacote) => (
              <div key={pacote.id} className="package-card-wrapper">
                <div className="package-card">
                  <img src={pacote.imagem} alt={pacote.nome} className="package-image" />
                  <div className="package-details">
                    <h3>{pacote.nome}</h3>
                    <p className="package-description">{pacote.descricao}</p>
                    <p className="package-price">A partir de R$ {pacote.preco}</p>
                    <button className="package-button">Ver Detalhes</button>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>

        {/* E aqui eu repito o processo para os Destinos Internacionais. */}
        <div className="carousel-section">
          <h2>Destinos Internacionais</h2>
          <Slider {...settings}>
            {pacotesInternacionais.map((pacote) => (
              <div key={pacote.id} className="package-card-wrapper">
                <div className="package-card">
                  <img src={pacote.imagem} alt={pacote.nome} className="package-image" />
                  <div className="package-details">
                    <h3>{pacote.nome}</h3>
                    <p className="package-description">{pacote.descricao}</p>
                    <p className="package-price">A partir de R$ {pacote.preco}</p>
                    <button className="package-button">Ver Detalhes</button>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>
      </main>

      <Footer />

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <AuthModal />
      </Modal>
    </div>
  );
};

export default Pacotes;