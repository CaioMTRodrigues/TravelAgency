import React, { useEffect, useState } from "react";
import { FaPix, FaBarcode, FaLock } from "react-icons/fa6";
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaCcPaypal } from "react-icons/fa";

// Este é o meu componente para exibir as formas de pagamento aceitas.
const FormasPagamento = () => {
  // Eu uso este estado para guardar a lista de formas de pagamento que virá da minha API.
  // Começa como uma lista vazia.
  const [formasPagamento, setFormasPagamento] = useState([]);

  // O 'useEffect' é ideal para buscar dados assim que o componente é carregado.
  // A lista de dependências vazia '[]' garante que a busca aconteça só uma vez.
  useEffect(() => {
    // Aqui eu estou simulando uma busca de dados em uma API.
    // No projeto real, eu colocaria a URL da minha API de verdade.
    fetch("https://suaapi.com/formas-pagamento")
      .then((res) => res.json())
      .then((data) => setFormasPagamento(data))
      .catch((err) => console.error("Erro ao carregar formas de pagamento:", err));
  }, []);

  return (
    <div className="formas-pagamento">
      <h2>Formas de Pagamento</h2>
      <p>Na <strong>Travel Agency</strong>, oferecemos várias opções seguras e práticas para você pagar suas viagens.</p>

      <section className="pagamento-tipos">
        {/*
          Aqui eu verifico se a lista 'formasPagamento' já tem algum item.
          Se tiver (length > 0), eu mostro a lista. Se não, mostro a mensagem "Carregando...".
        */}
        {formasPagamento.length > 0 ? (
          // O '.map()' percorre cada item da minha lista de formas de pagamento.
          formasPagamento.map((forma, index) => (
            <div key={index}>
              {/*
                Para cada forma de pagamento, eu verifico o 'tipo' dela
                e mostro o ícone correspondente.
              */}
              {forma.tipo === "pix" && <FaPix size={40} />}
              {forma.tipo === "boleto" && <FaBarcode size={40} />}
              {forma.tipo === "cartao" && (
                <>
                  <FaCcVisa size={30} />
                  <FaCcMastercard size={30} />
                  <FaCcAmex size={30} />
                </>
              )}
              {forma.tipo === "paypal" && <FaCcPaypal size={40} />}
              
              <h3>{forma.titulo}</h3>
              <p>{forma.descricao}</p>
            </div>
          ))
        ) : (
          <p>Carregando formas de pagamento...</p>
        )}
      </section>

      {/* Criei esta seção para reforçar a segurança e passar confiança ao cliente. */}
      <section className="seguranca">
        <FaLock size={40} />
        <h3>Pagamento Seguro</h3>
        <p>Utilizamos criptografia SSL e verificação antifraude para proteger seus dados.</p>
      </section>
    </div>
  );
};

export default FormasPagamento;