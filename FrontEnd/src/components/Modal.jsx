import React from 'react';
import { IoMdClose } from 'react-icons/io'; // Eu uso este ícone para o botão de fechar.

// Este é o meu componente genérico de Modal (ou pop-up).
// Ele é reutilizável para qualquer conteúdo que eu queira mostrar em um pop-up.
// Ele recebe três propriedades:
// - isOpen: um valor true/false que diz se o modal deve estar visível.
// - onClose: uma função que será chamada para fechar o modal.
// - children: representa qualquer conteúdo que eu colocar dentro do Modal (como o formulário de login).
const Modal = ({ isOpen, onClose, children }) => {
  // Uma verificação simples: se o modal não estiver aberto ('isOpen' é falso),
  // eu não retorno nada, e ele simplesmente não aparece na tela.
  if (!isOpen) {
    return null;
  }

  return (
    // Esta é a camada de fundo escura que cobre a página.
    // Se eu clicar nela (fora da caixa branca), a função 'onClose' é chamada para fechar o modal.
    <div className="modal-overlay" onClick={onClose}>
      
      {/*
        Esta é a caixa branca do modal.
        Eu adiciono um 'onClick' aqui com 'e.stopPropagation()'. Isso é um truque importante
        para impedir que o clique dentro do modal "vaze" para a camada de fundo,
        o que fecharia o modal sem querer.
      */}
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* O botão de fechar (X) no canto. Ao clicar, ele também chama a função 'onClose'. */}
        <button className="modal-close-button" onClick={onClose}>
          <IoMdClose size={24} />
        </button>
        
        {/* Aqui é onde o conteúdo (passado como 'children') será renderizado. */}
        {children}
      </div>
    </div>
  );
};

export default Modal;