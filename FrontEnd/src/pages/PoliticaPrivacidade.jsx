import React from 'react';
import './../assets/styles/styles.css';

const PoliticaPrivacidade = () => {
  return (
    <main className="static-page-container">
      <div className="static-page-header">
        <h1>Política de Privacidade</h1>
      </div>

      <div className="static-page-content legal-text">
        <p><strong>Última atualização: 06 de Agosto de 2025</strong></p>

        <p>A Travel Agency ("nós", "nosso") está comprometida em proteger a sua privacidade. Esta Política de Privacidade explica como coletamos, usamos, divulgamos e protegemos suas informações quando você utiliza nosso site e serviços.</p>

        <section>
          <h3>1. Informações que Coletamos</h3>
          <p>Podemos coletar as seguintes informações:</p>
          <ul>
            <li><strong>Informações Pessoais:</strong> Nome, e-mail, telefone, endereço, CPF, número de passaporte e data de nascimento, fornecidos durante o cadastro ou reserva.</li>
            <li><strong>Informações de Pagamento:</strong> Os dados de pagamento são processados por um gateway seguro (PayPal). Não armazenamos os detalhes do seu cartão de crédito em nossos servidores.</li>
            <li><strong>Informações de Uso:</strong> Dados sobre como você acessa e utiliza nosso site, como endereço IP, tipo de navegador e páginas visitadas.</li>
          </ul>
        </section>

        <section>
          <h3>2. Como Usamos Suas Informações</h3>
          <p>Utilizamos as informações coletadas para:</p>
          <ul>
            <li>Processar e gerenciar suas reservas e pagamentos.</li>
            <li>Comunicar-nos com você sobre sua conta ou viagens.</li>
            <li>Personalizar e melhorar sua experiência no site.</li>
            <li>Enviar e-mails de marketing e ofertas promocionais, caso você opte por recebê-los.</li>
            <li>Garantir a segurança e a operacionalidade de nossos serviços.</li>
          </ul>
        </section>

        <section>
          <h3>3. Compartilhamento de Informações</h3>
          <p>Não vendemos suas informações pessoais. Podemos compartilhar seus dados com:</p>
          <ul>
            <li><strong>Fornecedores de Serviços:</strong> Companhias aéreas, hotéis e operadores turísticos para efetivar sua reserva.</li>
            <li><strong>Processadores de Pagamento:</strong> Para autorizar e completar transações financeiras.</li>
            <li><strong>Autoridades Legais:</strong> Se exigido por lei ou para proteger nossos direitos.</li>
          </ul>
        </section>

        <section>
          <h3>4. Segurança dos Dados</h3>
          <p>Implementamos medidas de segurança administrativas, técnicas e físicas para proteger suas informações pessoais contra acesso não autorizado, uso ou divulgação.</p>
        </section>

        <section>
          <h3>5. Seus Direitos</h3>
          <p>Você tem o direito de acessar, corrigir ou excluir suas informações pessoais. Você pode fazer isso através das configurações da sua conta ou entrando em contato com nossa Central de Ajuda. Você também pode optar por não receber nossas comunicações de marketing a qualquer momento.</p>
        </section>
        
        <section>
          <h3>6. Cookies</h3>
          <p>Utilizamos cookies e tecnologias similares para melhorar a funcionalidade do site, analisar o tráfego e personalizar o conteúdo. Você pode gerenciar suas preferências de cookies através das configurações do seu navegador.</p>
        </section>

        <section>
          <h3>7. Alterações a esta Política</h3>
          <p>Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos sobre quaisquer alterações publicando a nova política nesta página. Recomendamos que você a revise regularmente.</p>
        </section>
      </div>
    </main>
  );
};

export default PoliticaPrivacidade;