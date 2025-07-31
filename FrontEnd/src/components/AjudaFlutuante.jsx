import React from "react";

// Criei este componente para ser o meu botão de ajuda flutuante,
// que fica fixo no canto da tela para o usuário acessar facilmente.
const AjudaFlutuante = () => {
  return (
    // O 'a' funciona como um link que, ao ser clicado,
    // leva o usuário para a página '/ajuda'.
    // A classe 'ajuda-botao' é para eu poder estilizar ele no CSS,
    // e o 'title' mostra uma dica quando o mouse passa por cima.
    <a href="/ajuda" className="ajuda-botao" title="Central de Ajuda">
      ❓
    </a>
  );
};

export default AjudaFlutuante;