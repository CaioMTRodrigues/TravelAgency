import React from 'react';

// Criei este componente para ser o rodapé do meu site.
// Como ele é um componente separado, posso reutilizá-lo em todas as páginas.
const Footer = () => {
  return (
    <footer className="rodape">
      {/* Criei esta seção para os ícones das minhas redes sociais. */}
      <div className="social">
        <a href="#"><img src="/imagens/facebook.png" alt="Facebook" /></a>
        <a href="#"><img src="/imagens/instagram.png" alt="Instagram" /></a>
        <a href="#"><img src="/imagens/whatsapp.png" alt="WhatsApp" /></a>
      </div>
      
      {/* Esta seção é para mostrar as formas de pagamento que eu aceito. */}
      <div className="pagamentos">
        <img src="/imagens/visa.png" alt="Visa" />
        <img src="/imagens/mastercard.png" alt="MasterCard" />
        <img src="/imagens/pix.png" alt="Pix" />
      </div>

      {/* Por fim, o aviso de copyright. */}
      <p>© 2025 Travel Agency</p>
    </footer>
  );
};

export default Footer;