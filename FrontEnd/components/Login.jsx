import React, { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulação de validação simples
    if (!email || !senha) {
      setErro("Preencha todos os campos");
      return;
    }

    // Simula chamada API
    fetch("https://api.exemplo.com/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Usuário ou senha inválidos");
        return res.json();
      })
      .then((data) => {
        setErro("");
        alert("Login realizado com sucesso!");
        // Aqui você pode redirecionar ou armazenar token etc
      })
      .catch((err) => setErro(err.message));
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Senha:</label>
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />

        {erro && <p className="erro">{erro}</p>}

        <button type="submit">Entrar</button>
      </form>
    </div>
  );
};

export default Login;