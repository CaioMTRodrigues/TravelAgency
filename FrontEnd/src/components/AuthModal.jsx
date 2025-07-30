import React, { useState } from 'react';
import Login from '../pages/Login';
import Cadastro from '../pages/Cadastro';

// Criei este componente para gerenciar a tela de autenticação.
// Ele decide se mostra o formulário de Login ou o de Cadastro.
const AuthModal = () => {
  // Este estado, 'isLoginView', controla qual formulário está visível.
  // Ele começa como 'true', então a primeira coisa que o usuário vê é a tela de login.
  const [isLoginView, setIsLoginView] = useState(true);

  return (
    <div className="auth-modal">
      {/* Aqui eu faço uma verificação simples: 'isLoginView' é verdadeiro? */}
      {isLoginView ? (
        // Se for verdadeiro, eu mostro o componente de Login.
        <>
          <Login />
          <p>
            Não tem uma conta?{' '}
            {/* Este botão muda o estado para 'false', mostrando a tela de cadastro. */}
            <button onClick={() => setIsLoginView(false)} className="auth-toggle-button">
              Cadastre-se
            </button>
          </p>
        </>
      ) : (
        // Se 'isLoginView' for falso, eu mostro o componente de Cadastro.
        <>
          <Cadastro />
          <p>
            Já possui uma conta?{' '}
            {/* Este botão muda o estado de volta para 'true', mostrando a tela de login. */}
            <button onClick={() => setIsLoginView(true)} className="auth-toggle-button">
              Faça login
            </button>
          </p>
        </>
      )}
    </div>
  );
};

export default AuthModal;