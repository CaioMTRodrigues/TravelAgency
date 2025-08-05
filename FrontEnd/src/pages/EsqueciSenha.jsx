import React, { useState } from "react";
import { solicitarRecuperacaoSenha } from "../services/authService";

const EsqueciSenha = () => {
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      setErro("Por favor, informe seu e-mail.");
      return;
    }

    setCarregando(true);
    setErro("");
    setMensagem("");

    try {
      const result = await solicitarRecuperacaoSenha(email);
      setMensagem(result.message || "Se o e-mail estiver cadastrado, você receberá instruções para redefinir sua senha.");
      setEmail(""); // Limpa o campo
    } catch (err) {
      const mensagemErro = typeof err === "string" ? err : "Erro ao solicitar recuperação de senha.";
      setErro(mensagemErro);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="login-form">
      <h2>Recuperar Senha</h2>
      <p className="esqueci-senha-descricao">
        Digite seu e-mail abaixo e enviaremos instruções para redefinir sua senha.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">E-mail</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu e-mail"
            required
          />
        </div>

        {erro && <p className="login-error-message">{erro}</p>}
        {mensagem && <p className="success-message">{mensagem}</p>}

        <button 
          type="submit" 
          className="login-button"
          disabled={carregando}
        >
          {carregando ? "Enviando..." : "Enviar"}
        </button>
      </form>

      <div className="forgot-password">
        <a href="/login">Voltar ao Login</a>
      </div>
    </div>
  );
};

export default EsqueciSenha;
