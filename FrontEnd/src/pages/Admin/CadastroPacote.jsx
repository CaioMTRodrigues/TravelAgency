import React, { useState } from "react";
import { cadastrarPacote } from "../../services/pacoteService";
import Spinner from "../../components/Spinner";
import "./CadastroPacote.css";

import axios from "axios";


const CadastroPacote = () => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: "",
    descricao: "",
    destino: "",
    duracao: "",
    dataInicio: "",
    dataFim: "",
    valor: "",
    imagemUrl: "",
  });

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [invalidFields, setInvalidFields] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErro("");
    setSucesso("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const camposInvalidos = [];

    if (!formData.titulo.trim()) camposInvalidos.push("titulo");
    if (!formData.descricao.trim()) camposInvalidos.push("descricao");
    if (!formData.destino.trim()) camposInvalidos.push("destino");
    if (!formData.dataInicio) camposInvalidos.push("dataInicio");
    if (!formData.dataFim) camposInvalidos.push("dataFim");
    if (isNaN(parseInt(formData.duracao))) camposInvalidos.push("duracao");
    if (isNaN(parseFloat(formData.valor))) camposInvalidos.push("valor");
    if (!formData.imagemUrl.trim()) camposInvalidos.push("imagemUrl");

    if (camposInvalidos.length > 0) {
      setErro("Preencha todos os campos obrigatórios");
      setInvalidFields(camposInvalidos);
      return;
    }

    setInvalidFields([]);
    setLoading(true);

    try {
      await cadastrarPacote({
        titulo: formData.titulo,
        descricao: formData.descricao,
        destino: formData.destino,
        duracaoDias: parseInt(formData.duracao),
        dataInicio: formData.dataInicio,
        dataFim: formData.dataFim,
        valor: parseFloat(formData.valor),
        imagemUrl: formData.imagemUrl,
      });

      setSucesso("Pacote cadastrado com sucesso!");
      setFormData({
        titulo: "",
        descricao: "",
        destino: "",
        duracao: "",
        dataInicio: "",
        dataFim: "",
        valor: "",
        imagemUrl: "",
      });
    } catch (err) {
      const mensagem =
        typeof err === "string"
          ? err
          : err?.response?.data?.message || "Erro ao cadastrar pacote.";
      setErro(mensagem);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cadastro-form">
      {loading && <Spinner />}
      <h2>Cadastro de Pacote</h2>
      <form onSubmit={handleSubmit}>
        {/* Campos padrão */}
        {["titulo", "descricao", "destino", "duracao", "dataInicio", "dataFim", "valor"].map((field) => (
          <div className="form-group" key={field}>
            <label htmlFor={field}>{field.charAt(0).toUpperCase() + field.slice(1)}*</label>
            <input
              type={field.includes("data") ? "date" : field === "valor" || field === "duracao" ? "number" : "text"}
              id={field}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className={invalidFields.includes(field) ? "input-error" : ""}
              step={field === "valor" ? "0.01" : undefined}
            />
          </div>
        ))}

        {/* Campo de imagem */}
        <div className="form-group">
  <label htmlFor="imagemUpload">Imagem do Pacote*</label>
  <input
    type="file"
    id="imagemUpload"
    accept="image/*"
    onChange={async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const formDataImagem = new FormData();
      formDataImagem.append("arquivo", file);

      try {
        const response = await axios.post("http://localhost:5000/api/imagens/upload", formDataImagem);
        const urlImagem = `http://localhost:5000/api/imagens/${response.data.nome}`;
        setFormData({ ...formData, imagemUrl: urlImagem });
        setSucesso("Imagem enviada com sucesso!");
      } catch (err) {
        console.log(err);
        setErro("Erro ao enviar imagem.");
      }
    }}
  />
</div>


        {erro && <p className="login-error-message">{erro}</p>}
        {sucesso && <p className="login-success-message">{sucesso}</p>}

        <button type="submit" className="login-button">
          Cadastrar Pacote
        </button>
      </form>
    </div>
  );
};

export default CadastroPacote;
