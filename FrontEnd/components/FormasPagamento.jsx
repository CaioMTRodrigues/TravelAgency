import React, { useEffect, useState } from "react";
import { FaPix, FaBarcode, FaLock } from "react-icons/fa6";
import { FaCcVisa, FaCcMastercard, FaCcAmex, FaCcPaypal } from "react-icons/fa";

const FormasPagamento = () => {
  const [formasPagamento, setFormasPagamento] = useState([]);

  useEffect(() => {
    // Simulação de requisição à API
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
        {formasPagamento.length > 0 ? (
          formasPagamento.map((forma, index) => (
            <div key={index}>
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

      <section className="seguranca">
        <FaLock size={40} />
        <h3>Pagamento Seguro</h3>
        <p>Utilizamos criptografia SSL e verificação antifraude para proteger seus dados.</p>
      </section>
    </div>
  );
};

export default FormasPagamento;