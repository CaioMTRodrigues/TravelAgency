import React from 'react';
import { Link } from 'react-router-dom'; // O Link já estava importado, ótimo!
import Slider from 'react-slick';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

// Criei estes componentes para customizar as setas do carrossel.
const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <div className="custom-arrow slick-next" onClick={onClick}>
      <FaChevronRight />
    </div>
  );
};

const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div className="custom-arrow slick-prev" onClick={onClick}>
      <FaChevronLeft />
    </div>
  );
};

// Meu componente de fileira de pacotes agora aceita um 'icon' como propriedade.
const PackageRow = ({ title, icon, packages = [], reverse = false }) => {
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    // A classe 'reverse' muda a ordem dos elementos (título e carrossel).
    <section className={`package-row ${reverse ? 'reverse' : ''}`}>
      <div className="row-title">
        {/* Adicionei esta div para agrupar o ícone e o título. */}
        <div className="title-with-icon">
          {icon}
          <h3>{title}</h3>
        </div>
        <p>Uma seleção de pacotes imperdíveis para você.</p>
        {/* E aqui estão os botões agora como links. */}
        <div className="title-buttons">
          <Link to="/pacotes">
            <button className="btn-package">Pacotes</button>
          </Link>
          <Link to="/ofertas">
            <button className="btn-offer">Ofertas</button>
          </Link>
        </div>
      </div>
      <div className="row-carousel">
        <Slider {...settings}>
          {packages.map(pkg => (
            // --- MUDANÇA APLICADA AQUI ---
            // O wrapper do card agora é um Link que leva para a página de detalhes.
            <Link to={`/pacotes/${pkg.id}`} key={pkg.id} className="promo-card-wrapper">
              <div className="promo-card">
                <img src={pkg.imagem} alt={pkg.nome} />
                <div className="promo-details">
                  <h4>{pkg.nome}</h4>
                  <p className="promo-date">{pkg.data}</p>
                  <p className="promo-price">R$ {pkg.preco}</p>
                </div>
              </div>
            </Link>
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default PackageRow;