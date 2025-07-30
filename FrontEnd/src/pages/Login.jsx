import React, { useState } from "react";

// Este é o meu componente para o formulário de login.
const Login = () => {
  // Eu uso estados separados para guardar o email, a senha e qualquer mensagem de erro.
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  // Criei esta função para lidar com o envio do formulário.
  const handleSubmit = (e) => {
    e.preventDefault(); // Isso impede que a página recarregue ao enviar o form.

    // Faço uma validação simples para ver se os campos não estão vazios.
    if (!email || !senha) {
      setErro("Preencha todos os campos");
      return; // A execução para aqui se houver um erro.
    }

    // Aqui eu simulo uma chamada para a minha API de login.
    // No futuro, vou substituir "https://api.exemplo.com/login" pela URL real.
    fetch("https://api.exemplo.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    })
      .then((res) => {
        // Se a resposta da API não for de sucesso, eu lanço um erro.
        if (!res.ok) throw new Error("Usuário ou senha inválidos");
        return res.json();
      })
      .then((data) => {
        // Se o login for bem-sucedido...
        setErro(""); // Limpo qualquer mensagem de erro antiga.
        alert("Login realizado com sucesso!");
        // Futuramente, é aqui que eu vou guardar o token de autenticação e redirecionar o usuário.
      })
      .catch((err) => setErro(err.message)); // Se qualquer etapa falhar, eu mostro a mensagem de erro.
  };

  return (
    // Eu uso a classe 'login-form' para que o CSS aplique o estilo que eu criei.
    <div className="login-form">
      <h2>Login</h2>
      
      {/* O 'onSubmit' no formulário chama a minha função 'handleSubmit'. */}
      <form onSubmit={handleSubmit}>
        {/*
          Eu agrupo cada 'label' e 'input' em uma 'div' para facilitar a estilização
          e manter o código organizado.
        */}
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

        {/* A mensagem de erro só aparece na tela se o estado 'erro' não estiver vazio. */}
        {erro && <p className="login-error-message">{erro}</p>}

        {/* Meu botão de login, com a classe para estilização. */}
        <button type="submit" className="login-button">
          Entrar
        </button>
      </form>

      {/* A seção para o link de 'Esqueci a senha'. */}
      <div className="forgot-password">
        <a href="/esqueci-senha">Esqueci a senha</a>
      </div>
    </div>
  );
};

export default Login;