import { getToken, parseJwt } from "./tokenUtils";

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;

  const payload = parseJwt(token);
  const now = Date.now() / 1000;
  return payload && payload.exp > now;
};

export const getUserRole = () => {
  const token = getToken();
  if (!token) return null;

  const payload = parseJwt(token);
  return payload?.role || null;
};
