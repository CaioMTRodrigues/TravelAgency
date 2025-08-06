import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import AuthModal from '../components/AuthModal';
import { Link } from 'react-router-dom';
import { listarTodosPacotes } from '../services/pacoteService'; // Importa a função da API
import Spinner from '../components/Spinner'; // Para carregar os pacotes
import './../assets/styles/styles.css';

// As perguntas do quiz permanecem as mesmas
const quizQuestions = [
    {
      question: "Qual é a primeira coisa que você coloca na mala?",
      answers: [
        { text: "Bota de trilha e bússola", type: "aventura" },
        { text: "Protetor solar e óculos de sol", type: "familia" },
        { text: "Meu melhor look para a noite", type: "amigos" },
        { text: "Um bom livro e uma playlist relaxante", type: "romance" },
      ],
    },
    {
      question: "Sua playlist de viagem ideal tem:",
      answers: [
        { text: "Músicas que dão energia para explorar", type: "aventura" },
        { text: "Clássicos que todo mundo canta junto", type: "familia" },
        { text: "As mais tocadas do momento para dançar", type: "amigos" },
        { text: "Músicas calmas e românticas", type: "romance" },
      ],
    },
    {
      question: "O que você prefere comer em uma viagem?",
      answers: [
        { text: "Comida local exótica, mesmo que seja estranha!", type: "aventura" },
        { text: "Restaurantes com opções para todos os gostos", type: "familia" },
        { text: "Bares e restaurantes da moda com bons drinks", type: "amigos" },
        { text: "Um jantar especial à luz de velas", type: "romance" },
      ],
    },
    {
      question: "Seu dia de férias perfeito é...",
      answers: [
        { text: "Subindo uma montanha ou explorando uma caverna", type: "aventura" },
        { text: "Na praia ou no parque com todo mundo se divertindo", type: "familia" },
        { text: "Conhecendo gente nova e curtindo a cidade", type: "amigos" },
        { text: "Relaxando a dois sem nenhuma preocupação", type: "romance" },
      ],
    },
    {
      question: "Qual o souvenir ideal para trazer de volta?",
      answers: [
        { text: "Um artesanato local único", type: "aventura" },
        { text: "Uma foto emoldurada de toda a família", type: "familia" },
        { text: "Uma camiseta engraçada ou uma piada interna", type: "amigos" },
        { text: "Um vinho ou chocolate especial da região", type: "romance" },
      ],
    },
    {
      question: "Como você descreve sua noite perfeita nas férias?",
      answers: [
        { text: "Ao redor de uma fogueira sob as estrelas", type: "aventura" },
        { text: "Uma noite de jogos de tabuleiro no hotel", type: "familia" },
        { text: "Em uma festa que dura até o amanhecer", type: "amigos" },
        { text: "Um passeio tranquilo de mãos dadas pela cidade", type: "romance" },
      ],
    },
    {
      question: "Qual paisagem mais te atrai?",
      answers: [
        { text: "Picos de montanhas e florestas densas", type: "aventura" },
        { text: "Um resort animado com piscinas enormes", type: "familia" },
        { text: "As luzes de uma cidade que nunca dorme", type: "amigos" },
        { text: "Uma praia deserta ao pôr do sol", type: "romance" },
      ],
    },
    {
      question: "O que não pode faltar no seu hotel?",
      answers: [
        { text: "Estar perto de trilhas e da natureza", type: "aventura" },
        { text: "Piscina, parquinho e atividades para crianças", type: "familia" },
        { text: "Um bar animado e boa localização", type: "amigos" },
        { text: "Uma varanda com uma vista espetacular", type: "romance" },
      ],
    },
    {
      question: "Qual filme de viagem te inspira mais?",
      answers: [
        { text: "Na Natureza Selvagem", type: "aventura" },
        { text: "Férias Frustradas", type: "familia" },
        { text: "Se Beber, Não Case!", type: "amigos" },
        { text: "Comer, Rezar, Amar", type: "romance" },
      ],
    },
    {
      question: "No final de um dia de viagem, você se sente mais feliz quando está:",
      answers: [
        { text: "Exausto, mas realizado por ter explorado tanto", type: "aventura" },
        { text: "Feliz por ver a alegria de todos ao redor", type: "familia" },
        { text: "Com muitas histórias e fotos para postar", type: "amigos" },
        { text: "Totalmente relaxado e conectado com seu par", type: "romance" },
      ],
    },
  ];

// Descrições para cada perfil
const resultDescriptions = {
  aventura: {
    title: "Seu destino é Aventura!",
    description: "Você tem um espírito explorador e ama a natureza e a adrenalina. Destinos com trilhas, montanhas e paisagens selvagens são a sua cara!",
  },
  familia: {
    title: "Sua viagem ideal é em Família!",
    description: "Você valoriza momentos de diversão e relaxamento com quem ama. Destinos com boa estrutura, segurança e atividades para todas as idades são perfeitos para você.",
  },
  amigos: {
    title: "Você nasceu para viajar com Amigos!",
    description: "Para você, viajar é sinônimo de festa, diversão e novas histórias para contar. Cidades com vida noturna agitada e muitas atividades em grupo são a escolha certa.",
  },
  romance: {
    title: "Uma viagem a dois é o que você precisa!",
    description: "Você busca cenários encantadores, jantares especiais e momentos inesquecíveis ao lado de quem ama. Destinos românticos e charmosos são o seu par perfeito.",
  },
};

const Quiz = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState({ aventura: 0, familia: 0, amigos: 0, romance: 0 });
  const [showResult, setShowResult] = useState(false);
  const [suggestedPackages, setSuggestedPackages] = useState(null);
  const [loading, setLoading] = useState(true);

  // Busca 4 pacotes aleatórios para as sugestões do quiz
  useEffect(() => {
    const fetchPackagesForQuiz = async () => {
      try {
        const allPackages = await listarTodosPacotes();
        // Embaralha e pega os 4 primeiros
        const shuffled = [...allPackages].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, 4);

        if (selected.length < 4) {
          console.warn("Não há pacotes suficientes para as 4 categorias do quiz.");
          // Lógica de fallback se houver menos de 4 pacotes
          while (selected.length > 0 && selected.length < 4) {
            selected.push(selected[0]);
          }
        }
        
        setSuggestedPackages({
          aventura: selected[0],
          familia: selected[1],
          amigos: selected[2],
          romance: selected[3],
        });
      } catch (error) {
        console.error("Erro ao carregar pacotes para o quiz:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackagesForQuiz();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleAnswerClick = (type) => {
    setScores(prevScores => ({ ...prevScores, [type]: prevScores[type] + 1 }));

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < quizQuestions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowResult(true);
    }
  };

  const getResult = () => {
    const finalResultType = Object.keys(scores).reduce((a, b) => scores[a] > scores[b] ? a : b);
    const resultDetails = resultDescriptions[finalResultType];
    const suggestedPackage = suggestedPackages[finalResultType];
    
    return {
      title: resultDetails.title,
      description: resultDetails.description,
      packageId: suggestedPackage?.id_Pacote,
      image: suggestedPackage?.imagemUrl || 'https://placehold.co/600x400/005A9C/white?text=Destino',
    };
  };
  
  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScores({ aventura: 0, familia: 0, amigos: 0, romance: 0 });
    setShowResult(false);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="home">
      <main className="quiz-page">
        <div className="quiz-container">
          {showResult ? (
            <div className="quiz-result">
              <img src={getResult().image} alt={getResult().title} />
              <h2>{getResult().title}</h2>
              <p>{getResult().description}</p>
              {getResult().packageId ? (
                <Link to={`/pacotes/${getResult().packageId}`} className="quiz-button">
                  Ver Pacote Sugerido
                </Link>
              ) : (
                <p>Nenhum pacote para sugerir no momento.</p>
              )}
              <button onClick={restartQuiz} className="btn-secondary-quiz">
                Fazer o quiz novamente
              </button>
            </div>
          ) : (
            <div className="quiz-question-area">
              <div className="progress-bar">
                <div className="progress-bar-inner" style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}></div>
              </div>
              <h2>{quizQuestions[currentQuestion].question}</h2>
              <div className="quiz-answers">
                {quizQuestions[currentQuestion].answers.map((answer, index) => (
                  <button key={index} onClick={() => handleAnswerClick(answer.type)}>
                    {answer.text}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <AuthModal />
      </Modal>
    </div>
  );
};

export default Quiz;