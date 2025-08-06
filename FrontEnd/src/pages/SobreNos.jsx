import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaPlaneDeparture, FaStar } from 'react-icons/fa';
import './../assets/styles/styles.css';

const SobreNos = () => {
  return (
    <main className="static-page-container">
      <div className="static-page-header" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?q=80&w=2070&auto=format&fit=crop')` }}>
        <h1>Apaixonados por Viagens, Dedicados a Você</h1>
      </div>
      
      <div className="static-page-content">
        <section>
          <h2>Nossa Missão</h2>
          <p>
            Na Travel Agency, nossa missão é transformar sonhos em realidade. Acreditamos que viajar é mais do que apenas visitar um novo lugar; é sobre criar memórias inesquecíveis, viver novas culturas e se reconectar consigo mesmo e com o mundo. Nosso compromisso é oferecer experiências de viagem autênticas e personalizadas, com a tranquilidade e a segurança que você merece.
          </p>
        </section>

        <section className="about-us-cards">
          <div className="about-card">
            <FaPlaneDeparture className="about-card-icon" />
            <h3>Experiências Selecionadas</h3>
            <p>Cada um de nossos pacotes é cuidadosamente elaborado por especialistas em viagens para garantir roteiros inteligentes, os melhores hotéis e atividades que realmente valem a pena.</p>
          </div>
          <div className="about-card">
            <FaStar className="about-card-icon" />
            <h3>Atendimento de Excelência</h3>
            <p>Sua satisfação é nossa prioridade. Oferecemos suporte completo, desde o planejamento da sua viagem até o seu retorno, garantindo que tudo ocorra perfeitamente.</p>
          </div>
          <div className="about-card">
            <FaHeart className="about-card-icon" />
            <h3>Paixão que Inspira</h3>
            <p>Somos um time de viajantes apaixonados. Usamos nossa própria experiência e amor por explorar o mundo para criar a viagem perfeita para você.</p>
          </div>
        </section>

        <section>
          <h2>Nossa História</h2>
          <p>
            Fundada em 2025, a Travel Agency nasceu do desejo de simplificar o processo de planejamento de viagens, tornando-o mais humano e acessível. Cansados de opções genéricas, decidimos criar uma plataforma onde cada viajante pudesse encontrar um destino que falasse diretamente à sua alma. Hoje, temos orgulho de ter ajudado centenas de clientes a descobrir novos horizontes.
          </p>
        </section>

        <section className="about-us-cta">
          <h2>Pronto para a sua próxima aventura?</h2>
          <p>Deixe-nos cuidar de todos os detalhes enquanto você apenas aproveita a jornada.</p>
          <Link to="/pacotes" className="btn-primary">Explore Nossos Destinos</Link>
        </section>
      </div>
    </main>
  );
};

export default SobreNos;