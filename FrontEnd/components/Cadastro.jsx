import React, { useState } from "react";

const Cadastro = () => {
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmaSenha: "",
    telefone: "",
    documento: "",
  });

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErro("");
    setSucesso("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validações básicas
    if (
      !formData.nome ||
      !formData.email ||
      !formData.senha ||
      !formData.confirmaSenha
    ) {
      setErro("Preencha todos os campos obrigatórios");
      return;
    }

    if (formData.senha !== formData.confirmaSenha) {
      setErro("As senhas não coincidem");
      return;
    }

    // Simula requisição para API
    fetch("https://api.exemplo.com/cadastro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro no cadastro");
        return res.json();
      })
      .then(() => {
        setErro("");
        setSucesso("Cadastro realizado com sucesso!");
        setFormData({
          nome: "",
          email: "",
          senha: "",
          confirmaSenha: "",
          telefone: "",
          documento: "",
        });
      })
      .catch((err) => setErro(err.message));
  };

  return (
    <div className="cadastro-container">
      <h2>Cadastro</h2>
      <form onSubmit={handleSubmit}>
        <label>Nome completo*</label>
        <input
          type="text"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          required
        />

        <label>Email*</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label>Senha*</label>
        <input
          type="password"
          name="senha"
          value={formData.senha}
          onChange={handleChange}
          required
        />

        <label>Confirme a senha*</label>
        <input
          type="password"
          name="confirmaSenha"
          value={formData.confirmaSenha}
          onChange={handleChange}
          required
        />

        <label>Telefone</label>
        <input
          type="tel"
          name="telefone"
          value={formData.telefone}
          onChange={handleChange}
        />

        <label>Documento (CPF, RG)</label>
        <input
          type="text"
          name="documento"
          value={formData.documento}
          onChange={handleChange}
        />

        {erro && <p className="erro">{erro}</p>}
        {sucesso && <p className="sucesso">{sucesso}</p>}

        <button type="submit">Cadastrar</button>
      </form>
    </div>
  );
};

export default Cadastro;