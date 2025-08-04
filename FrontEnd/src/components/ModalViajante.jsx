// src/components/ModalViajante.jsx
import React, { useEffect, useState } from "react";
import { listarViajantesDoUsuario, cadastrarViajante } from "../services/viajanteService";

const ModalViajante = ({ idUsuario, onSelecionar, onFechar }) => {
  const [viajantes, setViajantes] = useState([]);
  const [novoNome, setNovoNome] = useState("");
  const [novoDocumento, setNovoDocumento] = useState("");
  const [novaDataNascimento, setNovaDataNascimento] = useState("");


  useEffect(() => {
  const fetchViajantes = async () => {
    try {
      const data = await listarViajantesDoUsuario(idUsuario);
      setViajantes(data);
    } catch (err) {
      console.error("Erro ao buscar viajantes:", err.response?.data || err.message);
      alert("Erro ao buscar acompanhantes: " + (err.response?.data || err.message));
    }
  };
  fetchViajantes();
}, [idUsuario]);



  const handleCadastrarNovo = async () => {
   
try {
    const novo = {
      nome: novoNome,
      documento: novoDocumento,
      data_Nascimento: novaDataNascimento,
      id_Usuario: idUsuario,
    };
   

    
if (!novoNome || !novoDocumento || !novaDataNascimento) {
  alert("Preencha todos os campos!");
  return;
}


    const response = await cadastrarViajante(novo);
    setViajantes([...viajantes, response]);
    setNovoNome("");
    setNovoDocumento("");
    setNovaDataNascimento("");
    console.log("Novo viajante cadastrado:", response);
  } catch (err) {
    
    console.error("Erro ao cadastrar viajante:", err.response?.data || err.message);
     console.log("Enviando viajante:", {
  nome: novoNome,
  documento: novoDocumento,
  data_Nascimento: novaDataNascimento,
  id_Usuario: idUsuario,
});
  }
  
};


  return (
    <div className="modal">
      <h3>Selecionar ou Cadastrar Acompanhante</h3>

      <ul>
  {viajantes.map((v) => (
  <li key={v.id_Viajante}>
    {v.nome}
    <button onClick={() => onSelecionar(v)}>Selecionar</button>
  </li>
))}

</ul>


      <input
  type="text"
  placeholder="Nome do novo acompanhante"
  value={novoNome}
  onChange={(e) => setNovoNome(e.target.value)}
/>
<input
  type="text"
  placeholder="Documento"
  value={novoDocumento}
  onChange={(e) => setNovoDocumento(e.target.value)}
/>
<input
  type="date"
  placeholder="Data de nascimento"
  value={novaDataNascimento}
  onChange={(e) => setNovaDataNascimento(e.target.value)}
/>
<button onClick={handleCadastrarNovo}>Cadastrar Novo</button>
<button onClick={onFechar}>Fechar</button>

    </div>
  );
};

export default ModalViajante;
