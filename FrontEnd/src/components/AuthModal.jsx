import React, { useState, useEffect } from 'react'; // Adicione useEffect
import Login from '../pages/Login';
import Cadastro from '../pages/Cadastro';

// O componente agora recebe 'initialView' como uma propriedade
const AuthModal = ({ initialView }) => { 
  // O estado inicial de isLoginView agora é definido pela propriedade
  const [isLoginView, setIsLoginView] = useState(initialView === 'login');

  // Este useEffect garante que o modal mude se já estiver aberto
  useEffect(() => {
    setIsLoginView(initialView === 'login');
  }, [initialView]);

  return (
    <div className="auth-modal">
      {isLoginView ? (
        <>
          <Login />
          <p>
            Não tem uma conta?{' '}
            <button onClick={() => setIsLoginView(false)} className="auth-toggle-button">
              Cadastre-se
            </button>
          </p>
        </>
      ) : (
        <>
          <Cadastro />
          <p>
            Já possui uma conta?{' '}
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