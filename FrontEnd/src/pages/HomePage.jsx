import React, { useState } from "react";

// Aqui eu importo todos os componentes que vou usar para montar a minha página inicial.
// É como separar as peças de um quebra-cabeça antes de montar.
import Header from "../components/Header";
import Footer from "../components/Footer";
import AjudaFlutuante from "../components/AjudaFlutuante";
import BannerCarousel from "../components/BannerCarousel";
import IconNav from "../components/IconNav";
import FeaturedPackages from "../components/FeaturedPackages";
import Modal from "../components/Modal";
import AuthModal from "../components/AuthModal";

// E também importo meu arquivo de estilos principal.
import "./../assets/styles/styles.css";

// Este é o componente da minha página inicial, a principal página do site.
const HomePage = () => {
  // Eu preciso controlar o estado do modal de login a partir daqui,
  // porque é a HomePage que decide quando ele deve aparecer.
  // 'isModalOpen' começa como 'false' (fechado).
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Criei funções bem simples para deixar o código mais legível.
  // Uma para abrir e outra para fechar o modal.
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
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
      </main>

      {/* Uso meu componente de rodapé aqui. */}
      <Footer />

      {/* O botão de ajuda flutuante. */}
      <AjudaFlutuante />

      {/*
        Finalmente, eu renderizo o Modal.
        Ele só vai aparecer na tela quando 'isModalOpen' for verdadeiro.
        Eu passo a função 'closeModal' para que o próprio Modal saiba como se fechar.
        Dentro dele, eu coloco o 'AuthModal', que tem os formulários de login e cadastro.
      */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <AuthModal />
      </Modal>
    </div>
  );
};

export default HomePage;