import React from "react";
import AccordionItem from "../components/AccordionItem";
import { FaRegCreditCard, FaRegLifeRing, FaRegUserCircle, FaRegFileAlt } from 'react-icons/fa';
import "./../assets/styles/styles.css";

const CentralAjuda = () => {

  const faqsReservas = [
    {
      title: "Como faço para reservar uma viagem?",
      content: "É muito simples! Navegue até a página de 'Pacotes', escolha o destino dos seus sonhos, clique em 'Ver Detalhes' e siga as instruções na tela. Você precisará selecionar os viajantes e prosseguir para o pagamento."
    },
    {
      title: "Como sei se minha reserva foi confirmada?",
      content: "Após a confirmação do pagamento, sua reserva mudará para o status 'Confirmada'. Você receberá um e-mail com todos os detalhes e também poderá ver o status atualizado na sua área de 'Minhas Reservas'."
    }
  ];

  const faqsPagamentos = [
    {
      title: "Quais são as formas de pagamento aceitas?",
      content: "Aceitamos pagamentos seguros via PayPal, que inclui saldo da conta e os principais cartões de crédito. No futuro, planejamos adicionar mais opções como PIX e boleto bancário."
    },
    {
      title: "O site é seguro para inserir meus dados de pagamento?",
      content: "Sim, totalmente seguro. Todos os pagamentos são processados diretamente pelo PayPal, uma das plataformas mais seguras do mundo. Nós não armazenamos os dados do seu cartão de crédito."
    }
  ];

  const faqsAlteracoes = [
    {
      title: "Posso alterar ou cancelar minha reserva?",
      content: "As políticas de alteração e cancelamento variam conforme o pacote e a antecedência da solicitação. Para verificar as condições e solicitar uma alteração, acesse 'Minhas Reservas' e encontre a opção correspondente."
    },
    {
      title: "Como solicito um reembolso?",
      content: "Se sua reserva for elegível para reembolso de acordo com nossas políticas, o processo será iniciado automaticamente após o cancelamento. O prazo para o estorno pode variar dependendo da forma de pagamento."
    }
  ];

  return (
    <main className="help-center-container">
      <h1 className="help-center-title">Central de Ajuda</h1>
      <p className="help-center-subtitle">
        Olá! Como podemos te ajudar hoje? Encontre respostas rápidas abaixo.
      </p>

      <div className="faq-section">
        <h2><FaRegCreditCard /> Pagamentos</h2>
        {faqsPagamentos.map((faq, index) => (
          <AccordionItem key={index} title={faq.title} content={faq.content} />
        ))}
      </div>

      <div className="faq-section">
        <h2><FaRegLifeRing /> Reservas</h2>
        {faqsReservas.map((faq, index) => (
          <AccordionItem key={index} title={faq.title} content={faq.content} />
        ))}
      </div>

      <div className="faq-section">
        <h2><FaRegFileAlt /> Alterações e Cancelamentos</h2>
        {faqsAlteracoes.map((faq, index) => (
          <AccordionItem key={index} title={faq.title} content={faq.content} />
        ))}
      </div>

      <div className="contact-section">
          <h2><FaRegUserCircle /> Ainda precisa de ajuda?</h2>
          <p>Se não encontrou o que procurava, nossa equipe está pronta para ajudar.</p>
          <div className="contact-details">
              <p><strong>E-mail:</strong> suporte@travelagency.com</p>
              <p><strong>Telefone:</strong> (11) 4002-8922</p>
              <p><strong>Horário de Atendimento:</strong> Seg a Sex, das 9h às 18h.</p>
          </div>
      </div>
    </main>
  );
};

export default CentralAjuda;