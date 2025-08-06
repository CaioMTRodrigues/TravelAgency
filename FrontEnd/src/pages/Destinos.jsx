import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DestinationCarousel from '../components/DestinationCarousel';
import { FaMountain, FaUsers, FaHeart, FaUserFriends } from 'react-icons/fa';
import { listarTodosPacotes } from '../services/pacoteService'; // Importa a função da API
import Spinner from '../components/Spinner'; // Para uma melhor experiência de carregamento
import './../assets/styles/styles.css';

// Mapeamento de categorias para ícones e títulos
const categorias = {
  aventura: { title: 'Aventura', icon: <FaMountain /> },
  familia: { title: 'Família', icon: <FaUsers /> },
  amigos: { title: 'Amigos', icon: <FaUserFriends /> },
  romance: { title: 'Romance', icon: <FaHeart /> },
};

const Destinos = () => {
  const [pacotesPorCategoria, setPacotesPorCategoria] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPacotes = async () => {
      try {
        const todosPacotes = await listarTodosPacotes();

        // Agrupa os pacotes por uma "categoria" imaginária (aqui, estamos simulando)
        // No futuro, você pode adicionar um campo 'categoria' no seu backend
        const agrupados = {
          aventura: [],
          familia: [],
          amigos: [],
          romance: [],
        };

        // Simplesmente distribui os pacotes entre as categorias para o exemplo
        todosPacotes.forEach((pacote, index) => {
          const categoria = Object.keys(agrupados)[index % 4]; // Distribui de forma circular
          agrupados[categoria].push({
            id: pacote.id_Pacote,
            nome: pacote.titulo,
            imagem: pacote.imagemUrl,
            descricao: pacote.destino,
          });
        });

        setPacotesPorCategoria(agrupados);
      } catch (err) {
        setError('Não foi possível carregar os destinos. Tente novamente mais tarde.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPacotes();
  }, []);

  return (
    <div className="destinations-page-inspired">
      <div className="destinations-hero">
        <h1>Encontre a Viagem Perfeita para Você</h1>
        <div className="quiz-box">
          <h2>Não sabe para onde viajar?</h2>
          <p>Responda nosso quiz e encontre o destino perfeito para seu estilo!</p>
          <Link to="/quiz" className="quiz-button">Começar o Quiz</Link>
        </div>
      </div>

      <div className="destinations-content">
        {loading ? (
          <Spinner />
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : (
          Object.keys(pacotesPorCategoria).map(key => (
            <DestinationCarousel 
              key={key}
              title={categorias[key].title} 
              icon={categorias[key].icon} 
              destinations={pacotesPorCategoria[key]} 
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Destinos;