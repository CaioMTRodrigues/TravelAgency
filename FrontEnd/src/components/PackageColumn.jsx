import React from 'react';
import DestinyCard from './DestinyCard';

// Este é o meu componente para cada uma das 4 colunas de pacotes na página inicial.
// Ele é bem flexível: recebe um título, uma lista de pacotes e também "children".
// Eu uso o 'children' para poder colocar o filtro de "Saindo de:" dentro do cabeçalho da coluna.
const PackageColumn = ({ title, packages = [], children }) => {
  return (
    <div className="package-column">
      <div className="column-header">
        <h3>{title}</h3>
        {/* O 'children' é renderizado aqui. No caso da coluna de filtro,
            ele vai mostrar o menu de cidades. Nas outras colunas, não haverá nada.
        */}
        {children}
      </div>
      <div className="column-content">
        {/*
          Aqui eu uso a função '.map()' para percorrer a lista de pacotes.
          Para cada pacote na lista, eu renderizo o meu componente 'DestinyCard',
          passando as informações necessárias para ele.
        */}
        {packages.map((pkg) => (
          <DestinyCard key={pkg.id} imageUrl={pkg.imageUrl} name={pkg.name} link={pkg.link} />
        ))}
      </div>
    </div>
  );
};

export default PackageColumn;