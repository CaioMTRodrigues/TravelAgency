import React, { useState } from "react";
import { loginUsuario } from "../services/authService";
import { setToken } from "../utils/tokenUtils";

import { toast } from "react-toastify";


const Login = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !senha) {
      
      

      toast.warn("Preencha todos os campos");

      return;
    }

    try {
      const result = await loginUsuario({ email, password: senha });
      setToken(result.token); // salva o token JWT
      setErro("");
      
toast.success("Login realizado com sucesso!");

      onClose(); // Fecha o modal após o login
      window.location.reload(); // Recarrega a página para refletir o estado de login
    } catch (err) {
      const mensagem =
        typeof err === "string"
          ? err
          : err?.response?.data?.message || "Erro ao fazer login.";
      setErro(mensagem);
    }
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="senha">Senha</label>
          <input
            type="password"
            id="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>

        {erro && <p className="login-error-message">{erro}</p>}

        <button type="submit" className="login-button">
          Entrar
        </button>
      </form>

      <div className="forgot-password">
        <a href="/esqueci-senha">Esqueci a senha</a>
      </div>
    </div>
  );
};

export default Login;