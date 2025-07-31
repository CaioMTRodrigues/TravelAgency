import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Modal from "../components/Modal";
import AuthModal from "../components/AuthModal";
import AccordionItem from "../components/AccordionItem"; // Eu importo o componente de Acordeão que criei.
import { FaCreditCard, FaPlaneDeparture, FaPhoneAlt } from "react-icons/fa";
import "./../assets/styles/styles.css";

// Este é o meu componente para a página da Central de Ajuda.
const CentralAjuda = () => {
  // Eu preciso do estado do modal aqui também, para que o botão de login no Header funcione nesta página.
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Criei uma lista com as perguntas e respostas do FAQ.
  // Fica mais organizado e fácil de dar manutenção. No futuro, isso pode vir de uma API.
  const faqs = [
    {
      title: "Como faço para reservar uma viagem?",
      content: "O processo é simples! Basta navegar até a página de 'Pacotes', escolher o destino que mais lhe agrada, e clicar no botão para ver os detalhes e iniciar a reserva. Você será guiado passo a passo."
    },
    {
      title: "Quais são as formas de pagamento aceitas?",
      content: "Oferecemos diversas opções para sua comodidade. Aceitamos os principais cartões de crédito, com possibilidade de parcelamento, pagamento via PIX para aprovação imediata e também boleto bancário."
    },
    {
      title: "É possível alterar ou cancelar minha reserva?",
      content: "Sim. As políticas de alteração e cancelamento podem variar de acordo com o pacote escolhido. Você pode consultar as condições específicas e solicitar alterações diretamente no seu painel de 'Minhas Reservas' após o login."
    }
  ];

  return (
    // Eu uso a classe 'home' para garantir que o layout com o rodapé fixo funcione aqui também.
    <div className="home">
      <Header onLoginClick={openModal} />

      <main className="help-center-container">
        <h1 className="help-center-title">Central de Ajuda</h1>
        <p className="help-center-subtitle">
          Olá! Como podemos te ajudar hoje?
        </p>

        {/* Esta é a lista dos tópicos de ajuda que se expandem com o mouse. */}
        <div className="help-topics-list">
          <div className="help-topic-box">
            <div className="topic-header">
              <FaCreditCard size={28} />
              <h3>Pagamentos</h3>
            </div>
            <div className="topic-content">
              <p>Informações sobre parcelamento, PIX e outras formas de pagar.</p>
              <a href="#">Saiba mais</a>
            </div>
          </div>

          <div className="help-topic-box">
            <div className="topic-header">
              <FaPlaneDeparture size={28} />
              <h3>Sua Viagem</h3>
            </div>
            <div className="topic-content">
              <p>Detalhes sobre alteração, cancelamento e documentos.</p>
              <a href="#">Saiba mais</a>
            </div>
          </div>

          <div className="help-topic-box">
            <div className="topic-header">
              <FaPhoneAlt size={28} />
              <h3>Fale Conosco</h3>
            </div>
            <div className="topic-content">
              <p>Entre em contato com nossa equipe de especialistas.</p>
              <a href="#">Saiba mais</a>
            </div>
          </div>
        </div>

        {/*
          Esta é a seção do FAQ (Perguntas Frequentes).
          Ela é centralizada na página para dar mais destaque.
        */}
        <div id="faq" className="faq-section">
          <h2>Dúvidas Frequentes</h2>
          {/*
            Aqui eu uso o '.map()' para percorrer a minha lista de 'faqs'.
            Para cada item, eu renderizo o meu componente 'AccordionItem',
            passando a pergunta e a resposta para ele.
          */}
          {faqs.map((faq, index) => (
            <AccordionItem key={index} title={faq.title} content={faq.content} />
          ))}
        </div>
      </main>

      <Footer />

      {/* O modal de login também fica aqui, pronto para ser aberto. */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <AuthModal />
      </Modal>
    </div>
  );
};

export default CentralAjuda;