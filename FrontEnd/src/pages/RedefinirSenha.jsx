import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { redefinirSenha } from "../services/authService";

const RedefinirSenha = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [token, setToken] = useState("");

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    if (!tokenFromUrl) {
      setErro("Token inválido ou não fornecido.");
      return;
    }
    setToken(tokenFromUrl);
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!novaSenha || !confirmarSenha) {
      setErro("Preencha todos os campos.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    if (novaSenha.length < 6) {
      setErro("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setCarregando(true);
    setErro("");
    setMensagem("");

    try {
      const result = await redefinirSenha(token, novaSenha);
      setMensagem(result.message || "Senha redefinida com sucesso!");
      
      // Redireciona para login após 3 segundos
      setTimeout(() => {
        navigate("/login");
      }, 3000);
      
    } catch (err) {
      const mensagemErro = typeof err === "string" ? err : "Erro ao redefinir senha.";
      setErro(mensagemErro);
    } finally {
      setCarregando(false);
    }
  };

  if (!token) {
    return (
      <div className="login-form">
        <h2>Redefinir Senha</h2>
        <p className="login-error-message">Token inválido ou não fornecido.</p>
        <div className="forgot-password">
          <a href="/esqueci-senha">Solicitar nova recuperação</a>
        </div>
      </div>
    );
  }

  return (
    <div className="login-form">
      <h2>Redefinir Senha</h2>
      <p className="esqueci-senha-descricao">
        Digite sua nova senha abaixo.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="novaSenha">Nova Senha</label>
          <input
            type="password"
            id="novaSenha"
            value={novaSenha}
            onChange={(e) => setNovaSenha(e.target.value)}
            placeholder="Digite sua nova senha"
            minLength={6}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmarSenha">Confirmar Senha</label>
          <input
            type="password"
            id="confirmarSenha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            placeholder="Confirme sua nova senha"
            minLength={6}
            required
          />
        </div>

        {erro && <p className="login-error-message">{erro}</p>}
        {mensagem && (
          <div>
            <p className="success-message">{mensagem}</p>
            <p className="info-message">Redirecionando para o login...</p>
          </div>
        )}

        <button 
          type="submit" 
          className="login-button"
          disabled={carregando || mensagem}
        >
          {carregando ? "Redefinindo..." : "Redefinir Senha"}
        </button>
      </form>

      <div className="forgot-password">
        <a href="/login">Voltar ao Login</a>
      </div>
    </div>
  );
};

export default RedefinirSenha;
