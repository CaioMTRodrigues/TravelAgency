import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { FaPlane, FaHotel, FaMapMarkedAlt, FaUtensils, FaWifi, FaCar, FaInfoCircle, FaClock, FaCalendarAlt } from 'react-icons/fa';
import './../assets/styles/styles.css';
import { getPacoteById } from '../services/pacoteService';

// =============================================================================
// ALTERAÇÃO 3: Dados de voo e hotel foram padronizados para valores fixos.
// =============================================================================
const hotelPadrao = {
  nome: "Hotel Ibis",
  estrelas: 3,
  cafeIncluso: true,
  wifi: true,
  garagem: false,
};

const vooPadrao = {
  companhia: "Azul Linhas Aéreas",
  numero: "AD4001",
  saida: "Aeroporto de Origem (Não incluso)",
  chegada: "Aeroporto de Destino (Não incluso)",
};

// =============================================================================
// ALTERAÇÃO 1: Mapeamento de destinos para coordenadas geográficas para o mapa.
// Adicione novas coordenadas aqui conforme novos destinos forem criados.
// =============================================================================
const getCoordinatesForDestination = (destino) => {
  const locations = {
    'espanha': { lat: 40.416775, lng: -3.703790 }, // Madri, Espanha
    'recife': { lat: -8.047562, lng: -34.877002 }, // Recife, PE
    'chapada diamantina': { lat: -12.5858, lng: -41.3833 }, // Lençóis, BA
    'gramado': { lat: -29.3754, lng: -50.8753 }, // Gramado, RS
    'fernando de noronha': { lat: -3.8543, lng: -32.4245 }, // Fernando de Noronha, PE
    'rio de janeiro': { lat: -22.9068, lng: -43.1729 }, // Rio de Janeiro, RJ
    'chile': { lat: -33.4489, lng: -70.6693 }, // Santiago, Chile
  };
  // Converte o destino para minúsculas para a busca
  return locations[destino.toLowerCase()] || null;
};

// Componente do Mapa (sem alterações)
const MapComponent = ({ center, popupText }) => {
  const position = [center.lat, center.lng];
  return (
    <MapContainer center={position} zoom={10} scrollWheelZoom={false} className="map-container-small">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>{popupText}</Popup>
      </Marker>
    </MapContainer>
  );
};


const DetalhesPacote = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [pacote, setPacote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [moeda, setMoeda] = useState('BRL');
  const [destinationCoords, setDestinationCoords] = useState(null);

  useEffect(() => {
    const fetchPacote = async () => {
      window.scrollTo(0, 0);
      try {
        const pacoteData = await getPacoteById(id);
        setPacote(pacoteData);
        
        const coords = getCoordinatesForDestination(pacoteData.destino);
        setDestinationCoords(coords);

      } catch (err) {
        console.error("Erro ao buscar detalhes do pacote:", err);
        setError("Não foi possível carregar os detalhes do pacote. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchPacote();
  }, [id]);

  const converterMoeda = (valor) => {
    const taxas = { BRL: 1, USD: 0.18, EUR: 0.17 };
    const valorConvertido = valor * taxas[moeda];
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: moeda,
      minimumFractionDigits: 2
    }).format(valorConvertido);
  };

  const handleReservarClick = () => {
    navigate(`/reservar/${pacote.id_Pacote}`);
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div className="error-message" style={{ padding: '40px', textAlign: 'center' }}>{error}</div>;
  }

  if (!pacote) {
    return <div className="error-message" style={{ padding: '40px', textAlign: 'center' }}>Pacote não encontrado.</div>;
  }

  return (
    <div className="package-detail-page">
      <div className="detail-header" style={{ backgroundImage: `url(${pacote.imagemUrl})` }}>
        <div className="detail-header-overlay">
          <h1>{pacote.titulo}</h1>
        </div>
      </div>

      <div className="detail-content">
        <div className="detail-main-info">
          <div className="detail-info-section">
            <h2><FaMapMarkedAlt /> Sobre o Destino</h2>
            <p>{pacote.descricao || 'Descrição não disponível.'}</p>
          </div>

          {/* ========================================================================== */}
          {/* ALTERAÇÃO 2: "Período" e "Duração" agora estão em um card separado.      */}
          {/* ========================================================================== */}
          <div className="detail-info-section">
            <h2><FaInfoCircle /> Informações da Viagem</h2>
            <h4><FaCalendarAlt /> Período da Viagem</h4>
            <p>De {new Date(pacote.dataInicio).toLocaleDateString('pt-BR')} até {new Date(pacote.dataFim).toLocaleDateString('pt-BR')}</p>
            <h4><FaClock /> Duração</h4>
            <p>{pacote.duracaoDias} dias</p>
          </div>

          {/* ========================================================================== */}
          {/* ALTERAÇÃO 1: O mapa agora usa as coordenadas do destino e novo título.     */}
          {/* ========================================================================== */}
          {destinationCoords && (
            <div className="detail-info-section">
              <h2><FaMapMarkedAlt /> Localização</h2>
              <MapComponent center={destinationCoords} popupText={pacote.destino} />
            </div>
          )}
        </div>

        <div className="detail-sidebar">
          {/* ========================================================================== */}
          {/* ALTERAÇÃO 3: Informações de Voo e Hotel agora são fixas.                */}
          {/* ========================================================================== */}
          <div className="detail-card">
            <h3><FaPlane /> Informações do Voo</h3>
            <p><strong>Companhia:</strong> {vooPadrao.companhia}</p>
            <p><strong>Voo:</strong> {vooPadrao.numero}</p>
            <p><strong>Saída:</strong> {vooPadrao.saida}</p>
            <p><strong>Chegada:</strong> {vooPadrao.chegada}</p>
          </div>

          <div className="detail-card">
            <h3><FaHotel /> Informações do Hotel</h3>
            <p><strong>Hotel:</strong> {hotelPadrao.nome}</p>
            <p><strong>Classificação:</strong> {"⭐".repeat(hotelPadrao.estrelas)}</p>
            <div className="hotel-amenities">
              <span className={hotelPadrao.cafeIncluso ? 'available' : 'unavailable'}><FaUtensils /> Café da Manhã</span>
              <span className={hotelPadrao.wifi ? 'available' : 'unavailable'}><FaWifi /> Wi-Fi</span>
              <span className={hotelPadrao.garagem ? 'available' : 'unavailable'}><FaCar /> Garagem</span>
            </div>
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
          
          <button onClick={handleReservarClick} className="buy-package-button">
            RESERVAR AGORA
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetalhesPacote;