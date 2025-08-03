import React, { useState } from "react";
import { cadastrarUsuario } from "../services/usuarioService";
import Spinner from "../components/Spinner"; // Certifique-se de ter criado esse componente

const Cadastro = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    document: "",
  });

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErro("");
    setSucesso("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setErro("Preencha todos os campos obrigatórios");
      setSucesso("");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErro("As senhas não coincidem");
      setSucesso("");
      return;
    }

    setLoading(true); // Inicia o spinner

    try {
      const {
        name,
        email,
        password,
        phoneNumber,
        document,
        confirmPassword,
      } = formData;

      await cadastrarUsuario({
        name,
        email,
        password,
        phoneNumber,
        document,
        confirmPassword,
      });

      setSucesso("Cadastro realizado com sucesso!");
      setErro("");
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
        document: "",
      });
    } catch (err) {
      const mensagem =
        typeof err === "string"
          ? err
          : err?.response?.data?.message || "Erro ao cadastrar usuário.";
      setErro(mensagem);
      setSucesso("");
    } finally {
      setLoading(false); // Finaliza o spinner
    }
  };

  return (
    <div className="login-form">
      {loading && <Spinner />}
      <h2>Cadastro</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Nome completo*</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
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
          <label htmlFor="password">Senha*</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirme a senha*</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phoneNumber">Telefone</label>
          <input
            type="tel"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="document">Documento (CPF ou Passaporte)</label>
          <input
            type="text"
            id="document"
            name="document"
            value={formData.document}
            onChange={handleChange}
          />
        </div>

        {erro && <p className="login-error-message">{erro}</p>}
        {sucesso && <p className="login-success-message">{sucesso}</p>}

        <button type="submit" className="login-button">Cadastrar</button>
      </form>
    </div>
  );
};

export default Cadastro;
