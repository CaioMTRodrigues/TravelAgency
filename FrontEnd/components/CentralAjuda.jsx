import React from "react";

const CentralAjuda = () => {
  return (
    <div className="central-ajuda">
      <h2>Central de Ajuda</h2>
      <p>Estamos aqui para te ajudar! Veja abaixo algumas das dúvidas mais frequentes:</p>

      <div className="faq">
        <h3>📌 Como faço uma reserva?</h3>
        <p>Você pode acessar a página de pacotes, escolher o destino desejado e clicar em "Reservar agora".</p>

        <h3>📌 Quais são as formas de pagamento?</h3>
        <p>Cartão de crédito, débito, Pix e boleto bancário. Aceitamos todas as bandeiras principais.</p>

        <h3>📌 Como falar com um atendente?</h3>
        <p>Você pode clicar no ícone de chat flutuante no canto inferior direito para atendimento em tempo real.</p>

        <h3>📌 Posso cancelar minha viagem?</h3>
        <p>Sim! Você pode solicitar o cancelamento até 7 dias antes da viagem pelo seu painel de reservas.</p>
      </div>

      <div className="contato-ajuda">
        <h3>📞 Atendimento</h3>
        <p>Telefone: (11) 4002-8922</p>
        <p>Email: suporte@travelagency.com</p>
        <p>Horário: Segunda a Sábado das 08h às 18h</p>
      </div>
    </div>
  );
};

export default CentralAjuda;