import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
// Header e Footer removidos - já são renderizados globalmente no App.js
import Modal from '../components/Modal';
import AuthModal from '../components/AuthModal';
import Spinner from '../components/Spinner';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { FaPlane, FaHotel, FaMapMarkedAlt, FaUtensils, FaWifi, FaCar, FaSun } from 'react-icons/fa';
import './../assets/styles/styles.css';
import { getPacoteById } from '../services/pacoteService';

// Dados mockados padrão
const hotelMock = {
  nome: "Copacabana Palace, A Belmond Hotel",
  estrelas: 5,
  linkBooking: "https://www.booking.com/hotel/br/copacabana-palace-a-belmond-rio-de-janeiro.pt-br.html",
  cafeIncluso: true,
  wifi: true,
  garagem: true,
  coordenadas: { lat: -22.9673, lng: -43.1779 }
};

const vooMock = {
  companhia: "Azul Linhas Aéreas",
  numero: "AD4001",
  saida: "Aeroporto de Guarulhos (GRU)",
  chegada: "Aeroporto Santos Dumont (SDU)",
  previsaoSaida: "08:00",
  previsaoChegada: "09:05"
};

// Componente do Mapa
const MapComponent = ({ center, hotelName }) => {
  const position = [center.lat, center.lng];
  return (
    <MapContainer center={position} zoom={15} scrollWheelZoom={false} className="map-container-small">
      <TileLayer
        attribution='&copy; <a href="https://wwwetmap.org/copyright contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>{hotelName}</Popup>
      </Marker>
    </MapContainer>
  );
};

const DetalhesPacote = () => {
  const { id } = useParams();
  const [pacote, setPacote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [moeda, setMoeda] = useState('BRL');

  useEffect(() => {
    const fetchPacote = async () => {
      try {
        const pacoteEncontrado = await getPacoteById(id);

        const pacoteCompletado = {
          ...pacoteEncontrado,
          hotel: pacoteEncontrado.hotel || hotelMock,
          voo: pacoteEncontrado.voo || vooMock
        };

        setPacote(pacoteCompletado);
      } catch (error) {
        console.error("Erro ao buscar detalhes do pacote:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPacote();
  }, [id]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const converterMoeda = (valor) => {
    const taxas = { BRL: 1, USD: 0.18, EUR: 0.17 };
    const valorConvertido = valor * taxas[moeda];
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: moeda,
      minimumFractionDigits: 2
    }).format(valorConvertido);
  };

    if (!pacote) {
        return (
            <div className="home">
                <main style={{ padding: '40px', textAlign: 'center' }}>
                    <h2>Carregando detalhes do pacote...</h2>
                </main>
            </div>
        );
    }

    return (
        <div className="package-detail-page">
            <div className="detail-header" style={{ backgroundImage: `url(${pacote.imagem})` }}>
                <div className="detail-header-overlay">
                    <h1>{pacote.nome}</h1>
                </div>
            </div>

        <div className="detail-content">
          <div className="detail-main-info">
            <div className="detail-info-section">
              <h2><FaMapMarkedAlt /> Sobre o Destino</h2>
<p>{pacote.descricao || 'Descrição não disponível.'}</p>

            </div>

            <div className="detail-info-section">
              <h2><FaSun /> Melhor Época para Visitar</h2>
              <p>{pacote.info?.melhorEpoca || 'Informações não disponíveis.'}</p>
            </div>

            {pacote.hotel?.coordenadas && (
              <div className="detail-info-section">
                <h2><FaMapMarkedAlt /> Localização do Hotel</h2>
                <MapComponent center={pacote.hotel.coordenadas} hotelName={pacote.hotel.nome} />
              </div>
            )}
          </div>

          <div className="detail-sidebar">
            <div className="detail-card">
              <h3><FaPlane /> Informações do Voo</h3>
              <p><strong>Companhia:</strong> {pacote.voo.companhia}</p>
              <p><strong>Voo:</strong> {pacote.voo.numero}</p>
              <p><strong>Saída:</strong> {pacote.voo.saida} ({pacote.voo.previsaoSaida})</p>
              <p><strong>Chegada:</strong> {pacote.voo.chegada} ({pacote.voo.previsaoChegada})</p>
            </div>

            <div className="detail-card">
              <h3><FaHotel /> Informações do Hotel</h3>
              <p><strong>Hotel:</strong> {pacote.hotel.nome}</p>
              <p><strong>Classificação:</strong> {"⭐".repeat(pacote.hotel.estrelas)}</p>
              <div className="hotel-amenities">
                <span className={pacote.hotel.cafeIncluso ? 'available' : 'unavailable'}><FaUtensils /> Café da Manhã</span>
                <span className={pacote.hotel.wifi ? 'available' : 'unavailable'}><FaWifi /> Wi-Fi</span>
                <span className={pacote.hotel.garagem ? 'available' : 'unavailable'}><FaCar /> Garagem</span>
              </div>
              {pacote.hotel.linkBooking && (
                <a href={pacote.hotel.linkBooking} target="_blank" rel="noopener noreferrer" className="booking-link">
                  Ver no Booking.com
                </a>
              )}
            </div>

            <div className="price-box">
              <div className="price-header">
                <span className="price-label">A partir de</span>
                <div className="currency-converter">
                  <button onClick={() => setMoeda('BRL')} className={moeda === 'BRL' ? 'active' : ''}>BRL</button>
                  <button onClick={() => setMoeda('USD')} className={moeda === 'USD' ? 'active' : ''}>USD</button>
                  <button onClick={() => setMoeda('EUR')} className={moeda === 'EUR' ? 'active' : ''}>EUR</button>
                </div>
              </div>
              <p className="price-value">{converterMoeda(pacote.valor)}</p>
            </div>

                        <button className="buy-package-button">COMPRAR PACOTE AGORA</button>
                    </div>
                </div>

      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <AuthModal />
      </Modal>
    </div>
  );
};

export default DetalhesPacote;
