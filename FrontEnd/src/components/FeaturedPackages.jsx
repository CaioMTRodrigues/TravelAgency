<<<<<<< HEAD
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Garante que estamos a importar a função correta para buscar os destaques
import { getDestaquePackages } from '../services/pacoteService'; 
import { getUserRole } from '../utils/authGuard';
import './FeaturedPackages.css';
import Spinner from './Spinner';
=======
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { listarPacotes } from "../services/pacoteService";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./FeaturedPackages.css";
import { FaArrowRight, FaArrowLeft, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaTag } from "react-icons/fa";

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
>>>>>>> ed5609c3610fdbae2380527195cde0ed1cb397c8

const FeaturedPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userRole = getUserRole();

  useEffect(() => {
    const fetchDestaques = async () => {
      try {
        // Chama a função correta para buscar os pacotes marcados como destaque
        const data = await getDestaquePackages(); 
        setPackages(data);
      } catch (error) {
        console.error('Erro ao carregar pacotes em destaque:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestaques();
  }, []); // O array vazio [] garante que a busca acontece apenas uma vez

  const handleEdit = (packageId) => {
    navigate(`/admin/pacotes/editar/${packageId}`);
  };

  const handleDelete = async (packageId) => {
    if (window.confirm('Tem certeza que deseja excluir este pacote?')) {
      // Aqui viria a lógica para chamar a API para remover o pacote de verdade
      console.log(`Pacote ${packageId} excluído!`);
      setPackages(packages.filter(p => p.id_Pacote !== packageId));
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
<<<<<<< HEAD
    <div className="featured-packages">
      <h2 className="featured-title">Pacotes em Destaque</h2>
      <div className="packages-container">
        {Array.isArray(packages) && packages.length > 0 ? (
          packages.map((pacote) => (
            <div key={pacote.id_Pacote} className="package-card">
              <img 
                src={pacote.imagemUrl || 'https://placehold.co/600x400/005A9C/white?text=Destino'} 
                alt={pacote.titulo} 
                className="package-image"
              />
              <div className="package-info">
                <h3 className="package-name">{pacote.titulo}</h3>
                <p className="package-description">{pacote.descricao}</p>
                <p className="package-price">
                  {typeof pacote.valor === 'number'
                    ? `R$ ${pacote.valor.toFixed(2)}`
                    : 'Preço a consultar'}
=======
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
                <p><FaMapMarkerAlt className="icon" /> {pacote.destino}</p>
                <p><FaTag className="icon" /> R${pacote.valor.toFixed(2)}</p>
                <p><FaClock className="icon" /> {pacote.duracaoDias} dias</p>
                <p>
                  <FaCalendarAlt className="icon" />{" "}
                  {new Date(pacote.dataInicio).toLocaleDateString()} -{" "}
                  {new Date(pacote.dataFim).toLocaleDateString()}
>>>>>>> ed5609c3610fdbae2380527195cde0ed1cb397c8
                </p>
                <div className="package-actions">
                  {userRole === 'Admin' ? (
                    <>
                      <button className="btn-edit" onClick={() => handleEdit(pacote.id_Pacote)}>Editar</button>
                      <button className="btn-delete" onClick={() => handleDelete(pacote.id_Pacote)}>Excluir</button>
                    </>
                  ) : (
                    <button className="btn-details" onClick={() => navigate(`/pacotes/${pacote.id_Pacote}`)}>
                      Ver Detalhes
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="no-packages-message">Nenhum pacote em destaque no momento. Selecione até 6 pacotes no painel de gerenciamento.</p>
        )}
      </div>
    </div>
  );
};

export default FeaturedPackages;