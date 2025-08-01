import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Modal from "../components/Modal";
import AuthModal from "../components/AuthModal";
import DestinationCarousel from "../components/DestinationCarousel"; // Eu importo o novo componente de carrossel
import { FaMountain, FaUsers, FaHeart, FaUserFriends } from 'react-icons/fa';
import "./../assets/styles/styles.css";

// Criei uma base de dados de exemplo para cada tema.
// No futuro, isso virá da sua API.
const destinationsData = {
  aventura: [
    { id: 4, nome: "Fernando de Noronha", imagem: "https://a.cdn-hotels.com/gdcs/production55/d458/fc74de3b-0bd1-4284-b53b-be71ba136901.jpg", descricao: "Mergulho e natureza pura." },
    { id: 11, nome: "Machu Picchu, Peru", imagem: "https://wallpaperaccess.com/full/652493.jpg", descricao: "Trilhas e história inca." },
    { id: 5, nome: "Jalapão", imagem: "https://tse1.mm.bing.net/th/id/OIP.U60kTrfODzHMVhIQ-FOFCgHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3", descricao: "Dunas e fervedouros." },
    { id: 10, nome: "Cairo, Egito", imagem: "https://www.civitatis.com/blog/wp-content/uploads/2025/01/que-ver-cairo-egipto.jpg", descricao: "Pirâmides e mistérios." },
  ],
  familia: [
    { id: 2, nome: "Gramado", imagem: "https://gramadoinesquecivel.tur.br/img/gramado/img-gramado-5.jpg", descricao: "Magia e chocolate." },
    { id: 21, nome: "Resorts All-Inclusive", imagem: 'https://tse1.mm.bing.net/th/id/OIP.qKlzYIhzomh_Eo5VZjAT5AHaFj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3', descricao: "Diversão sem preocupações." },
    { id: 1, nome: "Rio de Janeiro", imagem: "https://wallpaperaccess.com/full/125819.jpg", descricao: "Praia e alegria." },
    { id: 8, nome: "Cancún, México", imagem: "https://tse4.mm.bing.net/th/id/OIP.MP9nZk52AVkhmKx2ZcfGyQHaEK?r=0&w=2560&h=1440&rs=1&pid=ImgDetMain&o=7&rm=3", descricao: "Mar do Caribe e parques." },
  ],
  amigos: [
    { id: 5, nome: "Salvador", imagem: "https://tse4.mm.bing.net/th/id/OIP.EN61-JMFnY1gZWQz7-KZQgHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3", descricao: "Festa e cultura." },
    { id: 8, nome: "Cancún, México", imagem: "https://tse4.mm.bing.net/th/id/OIP.MP9nZk52AVkhmKx2ZcfGyQHaEK?r=0&w=2560&h=1440&rs=1&pid=ImgDetMain&o=7&rm=3", descricao: "Praias e vida noturna." },
    { id: 102, nome: "Buenos Aires", imagem: "https://www.melhoresdestinos.com.br/wp-content/uploads/2019/02/passagens-aereas-buenos-aires-capa2019-02.jpg", descricao: "Tango e gastronomia." },
    { id: 1, nome: "Rio de Janeiro", imagem: "https://wallpaperaccess.com/full/125819.jpg", descricao: "Samba e paisagens." },
  ],
  romance: [
    { id: 3, nome: "Paris, França", imagem: "https://wallpaperaccess.com/full/296525.jpg", descricao: "A cidade do amor." },
    { id: 12, nome: "Santorini, Grécia", imagem: 'https://www.melhoresdestinos.com.br/wp-content/uploads/2021/04/santorini-grecia-capa-1536x805.jpg', descricao: "Pôr do sol inesquecível." },
    { id: 22, nome: "Lua de Mel", imagem: 'https://th.bing.com/th/id/OIP.91vrIQ0lewQKd5HHJmXKgHaE8?r=0&o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3', descricao: "Destinos perfeitos a dois." },
    { id: 7, nome: "Roma, Itália", imagem: "https://tse2.mm.bing.net/th/id/OIP.aRz4Gjf4Guxk8iRBfBXFWQHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3", descricao: "História e paixão." },
  ],
};

const Destinos = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="home">
      <Header onLoginClick={openModal} />
      <main className="destinations-page-inspired">
        <div className="destinations-hero">
            <h1>Encontre a Viagem Perfeita para Você</h1>
            <div className="quiz-box">
                <h2>Não sabe para onde viajar?</h2>
                <p>Responda nosso quiz e encontre o destino perfeito para seu estilo!</p>
                <a href="/quiz" className="quiz-button">Começar o Quiz</a>
            </div>
        </div>

        <div className="destinations-content">
            {/* Agora eu uso o meu novo componente de carrossel para cada tema. */}
            <DestinationCarousel title="Aventura" icon={<FaMountain/>} destinations={destinationsData.aventura} />
            <DestinationCarousel title="Família" icon={<FaUsers/>} destinations={destinationsData.familia} />
            <DestinationCarousel title="Amigos" icon={<FaUserFriends/>} destinations={destinationsData.amigos} />
            <DestinationCarousel title="Romance" icon={<FaHeart/>} destinations={destinationsData.romance} />
        </div>
      </main>
      <Footer />
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <AuthModal />
      </Modal>
    </div>
  );
};

export default Destinos;