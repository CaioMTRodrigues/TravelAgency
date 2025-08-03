import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { listarPacotes } from "../services/pacoteService";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./FeaturedPackages.css";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa";

// Setas personalizadas com ícones visíveis
const NextArrow = ({ onClick }) => (
  <div className="custom-arrow next-arrow" onClick={onClick}>
    <FaArrowRight className="arrow-icon" />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div className="custom-arrow prev-arrow" onClick={onClick}>
    <FaArrowLeft className="arrow-icon" />
  </div>
);

const FeaturedPackages = () => {
  const [pacotes, setPacotes] = useState([]);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPacotes = async () => {
      try {
        const dados = await listarPacotes();
        setPacotes(dados);
      } catch (err) {
        setErro(err.message || "Erro ao carregar pacotes.");
      }
    };

    fetchPacotes();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 2 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <section className="featured-packages">
      <h2>Pacotes em Destaque</h2>
      {erro && <p className="error-message">{erro}</p>}
      {pacotes.length === 0 ? (
        <p>Nenhum pacote disponível no momento.</p>
      ) : (
        <Slider {...settings}>
          {pacotes.map((pacote) => (
            <div key={pacote.id_Pacote} className="package-slide">
              <div className="package-card">
                <img src={pacote.imagemUrl} alt={pacote.titulo} />
                <h3>{pacote.titulo}</h3>
                <p>{pacote.destino}</p>
                <p>R${pacote.valor.toFixed(2)}</p>
                <p>{pacote.duracaoDias} dias</p>
                <p>
                  {new Date(pacote.dataInicio).toLocaleDateString()} -{" "}
                  {new Date(pacote.dataFim).toLocaleDateString()}
                </p>
                <button onClick={() => navigate(`/pacotes/${pacote.id_Pacote}`)}>
                  Ver detalhes
                </button>
              </div>
            </div>
          ))}
        </Slider>
      )}
    </section>
  );
};

export default FeaturedPackages;
