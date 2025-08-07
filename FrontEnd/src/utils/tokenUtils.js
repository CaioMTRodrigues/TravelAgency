export const setToken = (token) => {
  localStorage.setItem("token", token);
  
  // Extrai e salva dados do usuário do token
  const payload = parseJwt(token);
  
  if (payload) {
    // Tenta várias possibilidades de claims para o ID do usuário
    const userId = payload.nameid || payload.sub || payload.id || payload.userId || "";
    const userRole = payload.role || payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "";
    const userName = payload.unique_name || payload.name || payload.email || "";
    
    localStorage.setItem("idUsuario", userId);
    localStorage.setItem("userRole", userRole);
    localStorage.setItem("userName", userName);
  }
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const removeToken = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("idUsuario");
  localStorage.removeItem("userRole");
  localStorage.removeItem("userName");
};

export const parseJwt = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = atob(base64);
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Erro ao decodificar o token:", error);
    return null;
  }
};

// Funções auxiliares para obter dados do usuário
export const getUserId = () => {
  return localStorage.getItem("idUsuario");
};

export const getUserRole = () => {
  return localStorage.getItem("userRole");
};

export const getUserName = () => {
  return localStorage.getItem("userName");
};
