// FrontEnd/src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated } from '../utils/authGuard';

const ProtectedRoute = ({ children }) => {
  const isAuth = isAuthenticated();
  const location = useLocation();

  if (!isAuth) {
    // Se o usuário não estiver autenticado, redirecione para o login.
    // O `state={{ from: location }}` é um bônus: ele guarda a página que
    // o usuário tentou acessar, para que possamos redirecioná-lo de volta
    // após o login, se quisermos implementar essa lógica.
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se estiver autenticado, renderiza o componente filho (a página protegida).
  return children;
};

export default ProtectedRoute;