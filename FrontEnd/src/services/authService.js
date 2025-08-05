// FrontEnd/src/services/authService.js
import api from './api';

// A função de login que você já tinha
export const loginUsuario = async (userData) => {
    const response = await api.post('/User/login', userData);
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

// Função para solicitar recuperação de senha
export const solicitarRecuperacaoSenha = async (email) => {
    try {
        const response = await api.post('/User/forgot-password', { email });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Erro ao solicitar recuperação de senha.";
    }
};

// Função para redefinir senha
export const redefinirSenha = async (token, newPassword) => {
    try {
        const response = await api.post('/User/reset-password', { 
            token, 
            newPassword 
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.message || "Erro ao redefinir senha.";
    }
};
