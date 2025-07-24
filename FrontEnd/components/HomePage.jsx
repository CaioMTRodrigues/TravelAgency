import React from "react";
import AjudaFlutuante from "./AjudaFlutuante";
import "./../styles.css";

const HomePage = () => {
  return (
    <div className="home">
      <header className="menu">
        <h1>Travel Agency</h1>
        <nav>
          <a href="/">Início</a>
          <a href="/pacotes">Pacotes</a>
          <a href="/reservas">Reservas</a>
          <a href="/contato">Contato</a>
        </nav>
      </header>

      <section className="banner">
        <h2>Explore o mundo com a Travel Agency</h2>
        <p>Pacotes exclusivos para você</p>
      </section>

      <section className="pacotes">
        <h3>Pacotes em Destaque</h3>
        <div className="cards">
          <div className="card">
            <img src="/imagens/rio.jpg" alt="Rio de Janeiro" />
            <h4>Rio de Janeiro</h4>
            <p>A partir de R$999</p>
          </div>
          <div className="card">
            <img src="/imagens/gramado.jpg" alt="Gramado" />
            <h4>Gramado</h4>
            <p>A partir de R$1299</p>
          </div>
          <div className="card">
            <img src="/imagens/paris.jpg" alt="Paris" />
            <h4>Paris</h4>
            <p>A partir de R$4999</p>
          </div>
        </div>
      </section>

      <footer className="rodape">
        <div className="social">
          <a href="#"><img src="/imagens/facebook.png" alt="Facebook" /></a>
          <a href="#"><img src="/imagens/instagram.png" alt="Instagram" /></a>
          <a href="#"><img src="/imagens/whatsapp.png" alt="WhatsApp" /></a>
        </div>
        <div className="pagamentos">
          <img src="/imagens/visa.png" alt="Visa" />
          <img src="/imagens/mastercard.png" alt="MasterCard" />
          <img src="/imagens/pix.png" alt="Pix" />
        </div>
        <p>© 2025 Travel Agency</p>
      </footer>

      <AjudaFlutuante />
    </div>
  );
};

export default HomePage;