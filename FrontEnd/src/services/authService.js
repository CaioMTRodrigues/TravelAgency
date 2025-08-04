// FrontEnd/src/services/authService.js
import api from './api';

// A função de login que você já tinha
export const loginUsuario = async (userData) => {
    const response = await api.post('/user/login', userData);
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
    }
    return response.data;
};

// NOVA FUNÇÃO DE LOGOUT
// Esta função simplesmente remove o token do armazenamento local.
export const logout = () => {
    localStorage.removeItem('token');
};
