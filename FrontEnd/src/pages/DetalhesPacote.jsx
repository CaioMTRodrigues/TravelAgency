import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import AuthModal from '../components/AuthModal';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { FaPlane, FaHotel, FaMapMarkedAlt, FaUtensils, FaWifi, FaCar, FaSun } from 'react-icons/fa';
import "./../assets/styles/styles.css";

// Criei um "Banco de Dados" de exemplo com todos os pacotes detalhados e mais informações.
// No futuro, vou substituir isso por uma chamada à minha API.
const pacotesDB = [
  // Nacionais
  {
    id: 1,
    nome: "Rio de Janeiro",
    imagem: "https://wallpaperaccess.com/full/125819.jpg",
    preco: 927.00,
    info: {
        passeios: "Suba de bondinho ao Pão de Açúcar para vistas panorâmicas, tire a foto clássica no Cristo Redentor e passeie de bicicleta pelo calçadão de Copacabana e Ipanema.",
        oQueConhecer: "Explore a boemia e a arquitetura da Lapa, incluindo a Escadaria Selarón, visite o inovador Museu do Amanhã e relaxe nas tranquilas areias da Praia Vermelha.",
        melhorEpoca: "O Rio é ótimo o ano todo, mas os meses entre dezembro e março são perfeitos para quem busca calor e agito. Para um clima mais ameno, prefira entre abril e junho."
    },
    voo: {
        companhia: "Azul Linhas Aéreas", numero: "AD4001", saida: "Aeroporto de Guarulhos (GRU)",
        chegada: "Aeroporto Santos Dumont (SDU)", previsaoSaida: "08:00", previsaoChegada: "09:05"
    },
    hotel: {
        nome: "Copacabana Palace, A Belmond Hotel", estrelas: 5, linkBooking: "https://www.booking.com/hotel/br/copacabana-palace-a-belmond-rio-de-janeiro.pt-br.html",
        cafeIncluso: true, wifi: true, garagem: true,
        coordenadas: { lat: -22.9673, lng: -43.1779 }
    }
  },
  {
    id: 2,
    nome: "Gramado",
    imagem: "https://gramadoinesquecivel.tur.br/img/gramado/img-gramado-5.jpg",
    preco: 1350.00,
    info: {
        passeios: "Visita ao Lago Negro para um passeio de pedalinho, tour pela Rua Coberta e suas lojas, e uma deliciosa degustação de chocolates na Fábrica Prawer.",
        oQueConhecer: "Conheça o Mini Mundo e suas réplicas perfeitas, encante-se com a magia do Natal Luz (na temporada) e explore a charmosa cidade vizinha de Canela e sua Catedral de Pedra.",
        melhorEpoca: "O inverno (junho a agosto) é ideal para quem busca o frio e o charme europeu. A primavera (setembro a novembro) oferece o belo cenário das hortênsias floridas."
    },
    voo: {
        companhia: "GOL", numero: "G3 2112", saida: "Aeroporto de Congonhas (CGH)",
        chegada: "Aeroporto de Caxias do Sul (CXJ)", previsaoSaida: "10:30", previsaoChegada: "12:00"
    },
    hotel: {
        nome: "Hotel Ritta Höppner", estrelas: 5, linkBooking: "https://www.booking.com/hotel/br/ritta-hoppner.pt-br.html",
        cafeIncluso: true, wifi: true, garagem: true,
        coordenadas: { lat: -29.3754, lng: -50.8708 }
    }
  },
  {
    id: 4,
    nome: "Fernando de Noronha",
    imagem: "https://a.cdn-hotels.com/gdcs/production55/d458/fc74de3b-0bd1-4284-b53b-be71ba136901.jpg",
    preco: 2455.00,
    info: {
        passeios: "Mergulho com tartarugas na Baía dos Porcos, passeio de barco para avistar os golfinhos rotadores e uma trilha imperdível para a Baía do Sancho, eleita a praia mais bonita do mundo.",
        oQueConhecer: "Visite o Projeto Tamar para aprender sobre a conservação marinha, explore as praias do Leão e do Sueste e aproveite o pôr do sol inesquecível no Forte dos Remédios.",
        melhorEpoca: "A melhor época é entre agosto e fevereiro, quando o mar está mais calmo (o 'mar de dentro'), ideal para mergulho e praias."
    },
    voo: {
        companhia: "LATAM", numero: "LA3456", saida: "Aeroporto de Guarulhos (GRU)",
        chegada: "Aeroporto de Fernando de Noronha (FEN)", previsaoSaida: "07:00", previsaoChegada: "10:15"
    },
    hotel: {
        nome: "Pousada Maravilha", estrelas: 5, linkBooking: "https://www.booking.com/hotel/br/pousada-maravilha.pt-br.html",
        cafeIncluso: true, wifi: true, garagem: false,
        coordenadas: { lat: -3.8542, lng: -32.4278 }
    }
  },
  {
    id: 5,
    nome: "Salvador",
    imagem: "https://tse4.mm.bing.net/th/id/OIP.EN61-JMFnY1gZWQz7-KZQgHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    preco: 890.00,
    info: {
        passeios: "Faça um tour histórico pelo Pelourinho, desça pelo icônico Elevador Lacerda para apreciar a vista da Baía de Todos-os-Santos e visite o Farol da Barra ao entardecer.",
        oQueConhecer: "Experimente a autêntica culinária baiana no bairro boêmio do Rio Vermelho, amarre sua fitinha na Igreja de Nosso Senhor do Bonfim e relaxe na famosa praia do Porto da Barra.",
        melhorEpoca: "O verão (dezembro a fevereiro) é a alta temporada, com muito sol e festas, incluindo o Carnaval. Para evitar multidões e chuvas, prefira os meses de setembro a novembro."
    },
    voo: {
        companhia: "GOL", numero: "G3 1830", saida: "Aeroporto do Galeão (GIG)",
        chegada: "Aeroporto de Salvador (SSA)", previsaoSaida: "14:00", previsaoChegada: "16:10"
    },
    hotel: {
        nome: "Fera Palace Hotel", estrelas: 5, linkBooking: "https://www.booking.com/hotel/br/fera-palace.pt-br.html",
        cafeIncluso: true, wifi: true, garagem: true,
        coordenadas: { lat: -12.9731, lng: -38.5143 }
    }
  },
  // Internacionais
  {
    id: 3,
    nome: "Paris, França",
    imagem: "https://wallpaperaccess.com/full/296525.jpg",
    preco: 4899.00,
    info: {
        passeios: "Subida na Torre Eiffel para uma vista deslumbrante, visita guiada às obras-primas do Museu do Louvre, como a Monalisa, e um romântico passeio de barco pelo Rio Sena.",
        oQueConhecer: "Caminhe pela famosa avenida Champs-Élysées até o Arco do Triunfo, explore o bairro artístico de Montmartre e visite a imponente Catedral de Notre-Dame.",
        melhorEpoca: "A primavera (abril a junho) e o outono (setembro a outubro) oferecem clima agradável e menos multidões. O verão é quente e movimentado, e o inverno é frio, mas com charme natalino."
    },
    voo: {
        companhia: "Air France", numero: "AF457", saida: "Aeroporto de Guarulhos (GRU)",
        chegada: "Aeroporto Charles de Gaulle (CDG)", previsaoSaida: "18:00", previsaoChegada: "10:30 (+1 dia)"
    },
    hotel: {
        nome: "Hôtel Plaza Athénée", estrelas: 5, linkBooking: "https://www.booking.com/hotel/fr/plaza-athenee-paris.pt-br.html",
        cafeIncluso: true, wifi: true, garagem: true,
        coordenadas: { lat: 48.8666, lng: 2.3045 }
    }
  },
  {
    id: 6,
    nome: "Tóquio, Japão",
    imagem: "https://wallpapercave.com/wp/wp8438159.jpg",
    preco: 6450.00,
    info: {
        passeios: "Visita ao Templo Senso-ji em Asakusa, a experiência única de atravessar o Cruzamento de Shibuya e um tour pelos jardins do Palácio Imperial.",
        oQueConhecer: "Explore o centro da cultura pop em Akihabara e a moda de rua em Harajuku. Para vistas panorâmicas, suba na Tokyo Skytree ou na Torre de Tóquio.",
        melhorEpoca: "A primavera (março a maio) para ver as cerejeiras em flor, ou o outono (setembro a novembro) com suas cores vibrantes e clima agradável, são as épocas mais recomendadas."
    },
    voo: {
        companhia: "Emirates", numero: "EK262", saida: "Aeroporto de Guarulhos (GRU)",
        chegada: "Aeroporto de Narita (NRT)", previsaoSaida: "01:25", previsaoChegada: "07:50 (+2 dias)"
    },
    hotel: {
        nome: "Park Hyatt Tokyo", estrelas: 5, linkBooking: "https://www.booking.com/hotel/jp/park-hyatt-tokyo.pt-br.html",
        cafeIncluso: false, wifi: true, garagem: true,
        coordenadas: { lat: 35.685, lng: 139.69 }
    }
  },
  {
    id: 7,
    nome: "Roma, Itália",
    imagem: "https://tse2.mm.bing.net/th/id/OIP.aRz4Gjf4Guxk8iRBfBXFWQHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3",
    preco: 4550.00,
    info: {
        passeios: "Faça um tour guiado pelo Coliseu, Fórum Romano e Monte Palatino. Não deixe de visitar o Vaticano, incluindo a Basílica de São Pedro e os Museus do Vaticano, e jogue uma moeda na Fontana di Trevi.",
        oQueConhecer: "Passeie pela charmosa Piazza Navona, perca-se nas ruas do bairro de Trastevere para um jantar autêntico e suba os degraus da Escadaria da Praça de Espanha.",
        melhorEpoca: "A primavera (abril a junho) e o outono (setembro a outubro) são ideais, com temperaturas agradáveis e dias ensolarados. O verão pode ser muito quente e lotado."
    },
    voo: {
        companhia: "ITA Airways", numero: "AZ675", saida: "Aeroporto do Galeão (GIG)",
        chegada: "Aeroporto de Fiumicino (FCO)", previsaoSaida: "14:50", previsaoChegada: "07:00 (+1 dia)"
    },
    hotel: {
        nome: "Hotel Eden - Dorchester Collection", estrelas: 5, linkBooking: "https://www.booking.com/hotel/it/eden-rome.pt-br.html",
        cafeIncluso: true, wifi: true, garagem: false,
        coordenadas: { lat: 41.9056, lng: 12.4878 }
    }
  },
  {
    id: 8,
    nome: "Cancún, México",
    imagem: "https://tse4.mm.bing.net/th/id/OIP.MP9nZk52AVkhmKx2ZcfGyQHaEK?r=0&w=2560&h=1440&rs=1&pid=ImgDetMain&o=7&rm=3",
    preco: 3800.00,
    info: {
        passeios: "Nade com golfinhos em parques especializados, faça uma viagem de um dia para as impressionantes ruínas maias de Chichén Itzá e pegue um barco para a paradisíaca Isla Mujeres.",
        oQueConhecer: "Explore os cenotes (piscinas naturais subterrâneas) da região, aproveite a famosa vida noturna na Zona Hoteleira e relaxe nas praias de areia branca e mar azul-turquesa.",
        melhorEpoca: "De dezembro a abril é a melhor época, com clima mais seco e ensolarado. Evite a temporada de furacões, que vai de junho a novembro."
    },
    voo: {
        companhia: "Copa Airlines", numero: "CM702", saida: "Aeroporto de Guarulhos (GRU)",
        chegada: "Aeroporto de Cancún (CUN)", previsaoSaida: "05:20", previsaoChegada: "12:00"
    },
    hotel: {
        nome: "Hyatt Ziva Cancun", estrelas: 5, linkBooking: "https://www.booking.com/hotel/mx/hyatt-ziva-cancun.pt-br.html",
        cafeIncluso: true, wifi: true, garagem: true,
        coordenadas: { lat: 21.135, lng: -86.7483 }
    }
  },
];

// Componente do Mapa que usa o Leaflet (OpenStreetMap)
const MapComponent = ({ center, hotelName }) => {
  const position = [center.lat, center.lng];

  return (
    <MapContainer center={position} zoom={15} scrollWheelZoom={false} className="map-container-small">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [moeda, setMoeda] = useState('BRL');

    useEffect(() => {
        const pacoteEncontrado = pacotesDB.find(p => p.id.toString() === id);
        setPacote(pacoteEncontrado);
    }, [id]);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const converterMoeda = (valor) => {
      const taxas = {
        'BRL': 1, 'USD': 0.18, 'EUR': 0.17,
      };
      const valorConvertido = valor * taxas[moeda];
      return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: moeda, minimumFractionDigits: 2 }).format(valorConvertido);
    };

    if (!pacote) {
        return (
            <div className="home">
                <Header onLoginClick={openModal} />
                <main style={{ padding: '40px', textAlign: 'center' }}>
                    <h2>Carregando detalhes do pacote...</h2>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="home">
            <Header onLoginClick={openModal} />

            <main className="package-detail-page">
                <div className="detail-header" style={{ backgroundImage: `url(${pacote.imagem})` }}>
                    <div className="detail-header-overlay">
                        <h1>{pacote.nome}</h1>
                    </div>
                </div>

                <div className="detail-content">
                    <div className="detail-main-info">
                        <div className="detail-info-section">
                            <h2><FaMapMarkedAlt /> Sobre o Destino</h2>
                            <h4>Melhores Passeios</h4>
                            <p>{pacote.info.passeios}</p>
                            <h4>O que Conhecer</h4>
                            <p>{pacote.info.oQueConhecer}</p>
                        </div>
                        
                        <div className="detail-info-section">
                            <h2><FaSun /> Melhor Época para Visitar</h2>
                            <p>{pacote.info.melhorEpoca}</p>
                        </div>

                        <div className="detail-info-section">
                          <h2><FaMapMarkedAlt /> Localização do Hotel</h2>
                          <MapComponent center={pacote.hotel.coordenadas} hotelName={pacote.hotel.nome} />
                        </div>
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
                            {pacote.hotel.linkBooking && 
                                <a href={pacote.hotel.linkBooking} target="_blank" rel="noopener noreferrer" className="booking-link">
                                    Ver no Booking.com
                                </a>
                            }
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
                          <p className="price-value">{converterMoeda(pacote.preco)}</p>
                        </div>

                        <button className="buy-package-button">COMPRAR PACOTE AGORA</button>
                    </div>
                </div>
            </main>

            <Footer />

            <Modal isOpen={isModalOpen} onClose={closeModal}>
                <AuthModal />
            </Modal>
        </div>
    );
};

export default DetalhesPacote;