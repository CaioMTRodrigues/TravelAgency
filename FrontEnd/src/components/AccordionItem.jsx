import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

// Este é o meu componente para cada item da lista de perguntas frequentes (FAQ).
// Ele recebe um 'title' (a pergunta) e um 'content' (a resposta).
const AccordionItem = ({ title, content }) => {
  // Aqui eu uso o 'useState' para controlar se o item está aberto ou fechado.
  // Ele começa como 'false', ou seja, fechado.
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="accordion-item">
      {/* A área do título é clicável. Quando eu clico nela,
        a função 'setIsOpen' inverte o valor de 'isOpen' (de false para true, e vice-versa).
      */}
      <div className="accordion-title" onClick={() => setIsOpen(!isOpen)}>
        <h4>{title}</h4>
        <div className="accordion-icon">
          {/* Este é um truque legal: se 'isOpen' for verdadeiro, eu mostro o ícone de seta para cima.
            Se for falso, mostro o ícone de seta para baixo.
          */}
          {isOpen ? <FaChevronUp /> : <FaChevronDown />}
        </div>
      </div>

      {/* O conteúdo (a resposta) só é renderizado na tela se 'isOpen' for verdadeiro.
        O '&&' é um atalho em React para renderização condicional.
      */}
      {isOpen && <div className="accordion-content">{content}</div>}
    </div>
  );
};

export default AccordionItem;