import React from 'react';

// Criei este componente para ser o rodapé do meu site.
// Como ele é um componente separado, posso reutilizá-lo em todas as páginas.
const Footer = () => {
  return (
    <footer className="rodape">
      {/* Criei esta seção para os ícones das minhas redes sociais. */}
      <div className="social">
        <a href="#"><img src="https://th.bing.com/th/id/R.e790c25db5e52838040686612b1a732c?rik=uVuLX4sResGMKA&riu=http%3a%2f%2fpngimg.com%2fuploads%2ffacebook_logos%2ffacebook_logos_PNG19757.png&ehk=JL234rPBfx%2bf3tobhEVbPdNgJiWOhk251WyRwRAg940%3d&risl=&pid=ImgRaw&r=0" alt="Facebook" width={40} /></a>
        <a href="#"><img src="https://logodownload.org/wp-content/uploads/2017/04/instagram-logo-3.png" alt="Instagram" width={40}/></a>
        <a href="#"><img src="https://logospng.org/download/whatsapp/logo-whatsapp-verde-icone-ios-android-2048.png" alt="WhatsApp" width={40}/></a>
      </div>
      
      {/* Esta seção é para mostrar as formas de pagamento que eu aceito. */}
      <div className="pagamentos">
  <img
    src="https://logos-world.net/wp-content/uploads/2020/04/Visa-Emblem.jpg"
    alt="Visa"
    width={40}
    style={{ marginRight: '16px' }}
  />
  <img
    src="https://logosmarcas.net/wp-content/uploads/2020/09/Mastercard-Simbolo.jpg"
    alt="MasterCard"
    width={40}
    style={{ marginRight: '16px' }}
  />
  <img
    src="https://www.showmetech.com.br/wp-content/uploads/2023/01/novas-regras-do-pix-showmetech-6.png"
    alt="Pix"
    width={40}
  />
</div>

      {/* Por fim, o aviso de copyright. */}
      <p>© 2025 Travel Agency</p>
    </footer>
  );
};

export default Footer;