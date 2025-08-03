import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const CarrosselTeste = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const pacotesMock = [
    { id: 1, titulo: "Pacote 1", imagemUrl: "https://via.placeholder.com/300x160" },
    { id: 2, titulo: "Pacote 2", imagemUrl: "https://via.placeholder.com/300x160" },
    { id: 3, titulo: "Pacote 3", imagemUrl: "https://via.placeholder.com/300x160" },
    { id: 4, titulo: "Pacote 4", imagemUrl: "https://via.placeholder.com/300x160" },
  ];

  return (
    <div style={{ padding: "2rem", background: "#eee" }}>
      <h2>Carrossel de Teste</h2>
      <Slider {...settings}>
        {pacotesMock.map((p) => (
          <div key={p.id} style={{ padding: "1rem" }}>
            <img src={p.imagemUrl} alt={p.titulo} style={{ width: "100%", borderRadius: "8px" }} />
            <h3 style={{ textAlign: "center" }}>{p.titulo}</h3>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default CarrosselTeste;
