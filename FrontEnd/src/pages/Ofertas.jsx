import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Modal from "../components/Modal";
import AuthModal from "../components/AuthModal";
import Countdown from "../components/Countdown";
import { FaTag, FaCalendarAlt } from "react-icons/fa"; 
import "./../assets/styles/styles.css";

// Criei esta função para formatar o preço e garantir que ele sempre tenha centavos.
const formatPrice = (price) => {
  return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};

// Atualizei a base de dados de exemplo com as novas informações que você pediu.
const ofertasDB = [
  { id: 101, nome: "Maceió All-Inclusive", imagem: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/19/84/99/82/salinas-maceio-all-inclusive.jpg?w=1200&h=-1&s=1", desconto: 30, precoAntigo: 2200, precoNovo: 1540, categoria: "nacional", data: "10 a 15 de Outubro" },
  { id: 102, nome: "Buenos Aires", imagem: "https://www.melhoresdestinos.com.br/wp-content/uploads/2019/02/passagens-aereas-buenos-aires-capa2019-02.jpg", desconto: 20, precoAntigo: 1800, precoNovo: 1440, categoria: "internacional", data: "05 a 10 de Novembro" },
  { id: 103, nome: "Porto de Galinhas", imagem: "https://www.viagenscinematograficas.com.br/wp-content/uploads/2020/12/Porto-de-Galinhas-O-que-fazer-Capa-3-1536x1024.jpg", desconto: 25, precoAntigo: 1600, precoNovo: 1200, categoria: "nacional", data: "20 a 25 de Setembro" },
  { id: 104, nome: "Lisboa, Portugal", imagem: "https://cdn-imgix.headout.com/media/images/56af4fd54545bb353557638d2f3ece07-1848-lisbon-001-lisbon%7C-attractions-01.jpg?fm=pjpg&auto=compress&w=1200&crop=faces&fit=min", desconto: 15, precoAntigo: 5500, precoNovo: 4675, categoria: "internacional", data: "12 a 18 de Dezembro" },
];

// Atualizei a oferta destaque também.
const ofertaDestaque = { id: 101, nome: "Maceió All-Inclusive", imagem: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/19/84/99/82/salinas-maceio-all-inclusive.jpg?w=1200&h=-1&s=1", desconto: 30, precoAntigo: 2200, precoNovo: 1540, categoria: "nacional", data: "10 a 15 de Outubro" };

const Ofertas = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filtro, setFiltro] = useState('todos');

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const ofertasFiltradas = ofertasDB.filter(oferta => 
    filtro === 'todos' ? true : oferta.categoria === filtro
  );
  
  const dataFinalOferta = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

  return (
    <div className="home">
      <Header onLoginClick={openModal} />
      <main>
        <div className="offers-hero" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1501785888041-af3ef285b470')`}}>
          <div className="offers-hero-overlay">
            <h1>Ofertas que te levam mais longe</h1>
            <p>Sua próxima grande viagem com um preço que você não vai acreditar. Mas corra, é por tempo limitado!</p>
          </div>
        </div>
        <div className="offers-page-content">
          <section className="featured-offer-section">
            <h2>Oferta da Semana</h2>
            <div className="featured-offer-card">
              <img src={ofertaDestaque.imagem} alt={ofertaDestaque.nome} />
              <div className="featured-offer-details">
                <h3>{ofertaDestaque.nome}</h3>
                <p className="featured-offer-date"><FaCalendarAlt /> {ofertaDestaque.data}</p>
                <div className="featured-offer-pricing">
                  <span className="old-price">De {formatPrice(ofertaDestaque.precoAntigo)}</span>
                  <span className="new-price">Por {formatPrice(ofertaDestaque.precoNovo)}</span>
                </div>
                <p className="per-person-text">valor por pessoa</p>
                <div className="countdown-container">
                  <span>A oferta termina em:</span>
                  <Countdown targetDate={dataFinalOferta} />
                </div>
                <button className="buy-package-button">Eu Quero!</button>
              </div>
            </div>
          </section>
          <section className="offers-gallery-section">
            <h2>Todas as Ofertas</h2>
            <div className="offers-filters">
              <button onClick={() => setFiltro('todos')} className={filtro === 'todos' ? 'active' : ''}>Todos</button>
              <button onClick={() => setFiltro('nacional')} className={filtro === 'nacional' ? 'active' : ''}>Nacionais</button>
              <button onClick={() => setFiltro('internacional')} className={filtro === 'internacional' ? 'active' : ''}>Internacionais</button>
            </div>
            <div className="offers-grid">
              {ofertasFiltradas.map(oferta => (
                <div key={oferta.id} className="offer-card">
                  <div className="offer-card-image" style={{backgroundImage: `url(${oferta.imagem})`}}>
                    <div className="discount-tag"><FaTag /> {oferta.desconto}% OFF</div>
                  </div>
                  <div className="offer-card-details">
                    <h3>{oferta.nome}</h3>
                    <p className="offer-card-date"><FaCalendarAlt /> {oferta.data}</p>
                    <div className="offer-card-pricing">
                      <span className="old-price">{formatPrice(oferta.precoAntigo)}</span>
                      <span className="new-price">{formatPrice(oferta.precoNovo)}</span>
                    </div>
                    <p className="per-person-text-small">por pessoa</p>
                    <button className="package-button">Aproveitar Oferta</button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
        <section className="newsletter-section">
            <h2>Não perca nenhuma promoção!</h2>
            <p>Cadastre seu e-mail e seja o primeiro a saber das nossas ofertas exclusivas.</p>
            <form className="newsletter-form">
                <input type="email" placeholder="Seu melhor e-mail" />
                <button type="submit">Quero Receber!</button>
            </form>
        </section>
      </main>
      <Footer />
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <AuthModal />
      </Modal>
    </div>
  );
};

export default Ofertas;