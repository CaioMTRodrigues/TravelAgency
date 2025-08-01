import React, { useState, useEffect } from 'react';

// Criei este componente para mostrar um contador regressivo.
// Ele calcula o tempo restante até uma data final que eu definir.
const Countdown = ({ targetDate }) => {
  // Esta função calcula a diferença entre a data final e a data atual.
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
        horas: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutos: Math.floor((difference / 1000 / 60) % 60),
        segundos: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  // Eu uso este estado para guardar o tempo restante e poder atualizá-lo na tela.
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    // O timer atualiza a contagem a cada segundo (1000 milissegundos).
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    // Limpo o timer quando o componente é desmontado para não gastar memória.
    return () => clearTimeout(timer);
  });

  return (
    <div className="countdown-timer">
      {/*
        Eu percorro o objeto 'timeLeft' e crio um box para cada intervalo (dias, horas, etc.).
        O 'padStart' garante que o número sempre tenha dois dígitos (ex: 07 em vez de 7).
      */}
      {Object.entries(timeLeft).map(([intervalo, valor]) => (
        <div key={intervalo} className="countdown-segment">
          <span className="countdown-number">{valor.toString().padStart(2, '0')}</span>
          <span className="countdown-label">{intervalo}</span>
        </div>
      ))}
    </div>
  );
};

export default Countdown;