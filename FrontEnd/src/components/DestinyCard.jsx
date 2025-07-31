import React from 'react';

// Criei este componente para ser o "card" de um único destino.
// Ele é reutilizável, então posso usá-lo em várias partes do site.
// Ele recebe a URL da imagem, o nome do destino e um link como propriedades.
// Se eu não passar um link, ele usa "#" como padrão.
const DestinyCard = ({ imageUrl, name, link = '#' }) => {
  return (
    // Eu envolvo tudo em uma tag '<a>' para que o card inteiro seja clicável.
    <a href={link} className="destiny-card">
      {/* A imagem do destino. O 'alt={name}' é importante para acessibilidade. */}
      <img src={imageUrl} alt={name} />
      {/* Esta div é para o nome do destino, que eu estilizo no CSS
         para aparecer sobre a imagem. */}
      <div className="destiny-name">{name}</div>
    </a>
  );
};

export default DestinyCard;