import React, { useState } from "react";

// Este é o meu componente para o formulário de cadastro de novos usuários.
const Cadastro = () => {
  // Criei um estado único, 'formData', para guardar todos os dados do formulário em um objeto.
  // Fica mais organizado do que ter um estado para cada campo.
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    confirmaSenha: "",
    telefone: "",
    documento: "",
  });

  // Tenho estados separados para as mensagens de erro e de sucesso.
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  // Esta função é chamada toda vez que eu digito em qualquer um dos campos.
  const handleChange = (e) => {
    // Ela atualiza o 'formData', pegando o 'name' do campo (ex: "email")
    // e atualizando seu valor com o que eu digitei (e.target.value).
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Eu também limpo as mensagens de erro e sucesso para o usuário poder tentar de novo.
    setErro("");
    setSucesso("");
  };

  // Esta função é executada quando eu envio o formulário (clico no botão "Cadastrar").
  const handleSubmit = (e) => {
    e.preventDefault(); // Impede que a página recarregue, que é o comportamento padrão de um form.

    // Faço algumas validações básicas primeiro.
    if (
      !formData.nome ||
      !formData.email ||
      !formData.senha ||
      !formData.confirmaSenha
    ) {
      setErro("Preencha todos os campos obrigatórios");
      return; // A função para aqui se houver erro.
    }

    if (formData.senha !== formData.confirmaSenha) {
      setErro("As senhas não coincidem");
      return;
    }

    // Se todas as validações passarem, eu simulo o envio dos dados para a minha API.
    fetch("https://api.exemplo.com/cadastro", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao tentar realizar o cadastro. Tente novamente.");
        return res.json();
      })
      .then(() => {
        // Se a API responder com sucesso...
        setErro(""); // Limpo qualquer erro antigo.
        setSucesso("Cadastro realizado com sucesso!"); // Mostro a mensagem de sucesso.
        // E limpo todos os campos do formulário para um novo cadastro.
        setFormData({
          nome: "",
          email: "",
          senha: "",
          confirmaSenha: "",
          telefone: "",
          documento: "",
        });
      })
      .catch((err) => setErro(err.message)); // Se a API der erro, eu mostro a mensagem de erro.
  };

  return (
    // Eu reutilizo a classe 'login-form' aqui para aproveitar os mesmos estilos
    // e manter a consistência visual entre o login e o cadastro.
    <div className="login-form"> 
      <h2>Cadastro</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nome">Nome completo*</label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email*</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="senha">Senha*</label>
          <input
            type="password"
            id="senha"
            name="senha"
            value={formData.senha}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmaSenha">Confirme a senha*</label>
          <input
            type="password"
            id="confirmaSenha"
            name="confirmaSenha"
            value={formData.confirmaSenha}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="telefone">Telefone</label>
          <input
            type="tel"
            id="telefone"
            name="telefone"
            value={formData.telefone}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="documento">Documento (CPF, Passaporte)</label>
          <input
            type="text"
            id="documento"
            name="documento"
            value={formData.documento}
            onChange={handleChange}
          />
        </div>

        {/* Eu mostro a mensagem de erro ou de sucesso aqui, se elas existirem. */}
        {erro && <p className="login-error-message">{erro}</p>}
        {sucesso && <p className="login-success-message">{sucesso}</p>}

        <button type="submit" className="login-button">Cadastrar</button>
      </form>
    </div>
  );
};

export default Cadastro;