import api from './api';

// Busca todas as avaliações para o painel de admin
export const listarTodasAvaliacoes = async () => {
    try {
        const response = await api.get('/evaluation/admin');
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar avaliações:", error);
        throw error;
    }
};

// Exclui uma avaliação pelo ID
export const excluirAvaliacao = async (id) => {
    try {
        await api.delete(`/evaluation/${id}`);
    } catch (error) {
        console.error(`Erro ao excluir avaliação ${id}:`, error);
        throw error;
    }
};
