import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import axios from 'axios';
import { isAuthenticated } from '../utils/authGuard'; // Importado para verificar o login

// Importações do React Leaflet para o mapa
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet'; // Importa a biblioteca Leaflet para corrigir o ícone do marcador

// Importação dos ícones e do CSS
import {
  FaPlane, FaHotel, FaMapMarkedAlt, FaUtensils, FaWifi, FaCar,
  FaInfoCircle, FaClock, FaCalendarAlt, FaCreditCard, FaRegCompass
} from 'react-icons/fa';
import './../assets/styles/styles.css';
import { getPacoteById } from '../services/pacoteService';

// Corrige o problema do ícone padrão do marcador do Leaflet não aparecer
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Dados de voo e hotel padronizados para valores fixos
const hotelPadrao = {
  nome: "Hotel Premium",
  estrelas: 4,
  cafeIncluso: true,
  wifi: true,
  garagem: true,
};

const vooPadrao = {
  companhia: "LATAM Airlines",
  numero: "LA3001",
  saida: "Aeroporto de Origem (Não incluso)",
  chegada: "Aeroporto de Destino (Não incluso)",
};

// Componente do Mapa (agora mais robusto)
const MapComponent = ({ center, popupText }) => {
  // Se o centro não for encontrado, exibe a mensagem de indisponibilidade
  if (!center) {
    return <p>Localização não disponível.</p>;
  }
  const position = [center.lat, center.lng];
  return (
    <MapContainer center={position} zoom={11} scrollWheelZoom={false} className="map-container-small">
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

const DetalhesPacote = ({ openModal }) => { // Recebendo openModal como prop
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
        setLoading(true);
        const pacoteData = await getPacoteById(id);
        setPacote(pacoteData);

        // --- LÓGICA DO MAPA ATUALIZADA ---
        // Se o pacote tiver um destino, busca as coordenadas dele
        if (pacoteData && pacoteData.destino) {
          try {
            const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(pacoteData.destino)}`);
            if (response.data && response.data.length > 0) {
              const { lat, lon } = response.data[0];
              setDestinationCoords({ lat: parseFloat(lat), lng: parseFloat(lon) });
            } else {
              // Se a API não encontrar o local, define as coordenadas como nulas
              console.warn(`Coordenadas não encontradas para: ${pacoteData.destino}`);
              setDestinationCoords(null);
            }
          } catch (geoError) {
            console.error("Erro ao buscar coordenadas:", geoError);
            setDestinationCoords(null);
          }
        }
        // --- FIM DA LÓGICA DO MAPA ---

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
    if (isAuthenticated()) {
      navigate(`/reservar/${pacote.id_Pacote}`);
    } else {
      openModal('login');
    }
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
            <h2><FaRegCompass /> Sobre o Destino</h2>
            <p>{pacote.descricao || 'Descrição não disponível.'}</p>
          </div>

          <div className="detail-info-section">
            <h2><FaInfoCircle /> Informações da Viagem</h2>
            <h4><FaCalendarAlt /> Período da Viagem</h4>
            <p>De {new Date(pacote.dataInicio).toLocaleDateString('pt-BR')} até {new Date(pacote.dataFim).toLocaleDateString('pt-BR')}</p>
            <h4><FaClock /> Duração</h4>
            <p>{pacote.duracaoDias} dias</p>
          </div>

          <div className="detail-info-section">
            <h2><FaMapMarkedAlt /> Localização no Mapa</h2>
            <MapComponent center={destinationCoords} popupText={pacote.destino} />
          </div>
        </div>

        <div className="detail-sidebar">
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
              <span className="price-label">Valor por pessoa</span>
              <div className="currency-converter">
                <button onClick={() => setMoeda('BRL')} className={moeda === 'BRL' ? 'active' : ''}>R$</button>
                <button onClick={() => setMoeda('USD')} className={moeda === 'USD' ? 'active' : ''}>$</button>
                <button onClick={() => setMoeda('EUR')} className={moeda === 'EUR' ? 'active' : ''}>€</button>
              </div>
            </div>
            <p className="price-value">{converterMoeda(pacote.valor)}</p>
          </div>
          
          <button onClick={handleReservarClick} className="buy-package-button">
            <FaCreditCard /> RESERVAR AGORA
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetalhesPacote;