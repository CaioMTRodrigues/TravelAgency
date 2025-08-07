import api from "./api";

export const getDestaquePackages = async () => {
  try {
    // Garante que estamos a chamar o endpoint correto /api/package/destaques
    const response = await api.get("/package/destaques");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar pacotes em destaque:", error);
    return [];
  }
};

// Função para atualizar o status de destaque de um pacote
export const atualizarDestaquePacote = async (id, destaque) => {
  try {
    await api.put(`/package/${id}/destaque`, destaque, {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(`Erro ao atualizar destaque do pacote ${id}:`, error);
    throw (
      error.response?.data || "Não foi possível atualizar o status de destaque."
    );
  }
};

// --- Funções existentes ---
export const cadastrarPacote = async (pacoteData) => {
  const response = await api.post("/package", pacoteData);
  return response.data;
};

export const listarTodosPacotes = async () => {
  try {
    const response = await api.get("/package");
    return response.data;
  } catch (error) {
    console.error("Erro ao listar todos os pacotes:", error);
    throw error;
  }
};

export const excluirPacote = async (id) => {
  try {
    const response = await api.delete(`/package/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao excluir o pacote ${id}:`, error);
    throw error;
  }
};

export const getPacoteById = async (id) => {
  try {
    const response = await api.get(`/package/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar o pacote ${id}:`, error);
    throw error;
  }
};

export const atualizarPacote = async (id, pacoteData) => {
  try {
    const response = await api.put(`/package/${id}`, pacoteData);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar o pacote ${id}:`, error);
    throw error;
  }
};
