import React, { useState } from 'react';
import PackageColumn from './PackageColumn';
import { FaMapPin } from 'react-icons/fa';

// Para organizar a página, eu criei alguns objetos com os dados dos pacotes.
// No futuro, quando eu conectar o backend, esses dados virão da minha API.
const allPackages = {
  nacionais: [
    { id: 1, name: 'Fernando de Noronha', imageUrl: 'https://th.bing.com/th/id/OIP.GzDQUQVdupnjgDW4JilrywHaEK?w=300&h=180&c=7&r=0&o=7&pid=1.7&rm=3' },
    { id: 2, name: 'Lençóis Maranhenses', imageUrl: 'https://tse3.mm.bing.net/th/id/OIP.sPFGeh0slfAwOmEyovGpbwHaEo?r=0&rs=1&pid=ImgDetMain&o=7&rm=3' },
    { id: 3, name: 'Chapada Diamantina', imageUrl: 'https://tse3.mm.bing.net/th/id/OIP.VpvRjDOPXLcEZemuQ2NEDQHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3' },
    { id: 4, name: 'Bonito', imageUrl: 'https://tse3.mm.bing.net/th/id/OIP.AdEHyzMAtvousJFyOE8z7QHaEw?r=0&rs=1&pid=ImgDetMain&o=7&rm=3' },
    { id: 5, name: 'Jalapão', imageUrl: 'https://tse1.mm.bing.net/th/id/OIP.U60kTrfODzHMVhIQ-FOFCgHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3' },
    { id: 6, name: 'Amazônia', imageUrl: 'https://wallpaperaccess.com/full/4736710.jpg' },
  ],
  internacionais: [
    { id: 7, name: 'Paris, França', imageUrl: 'https://wallpaperaccess.com/full/1137644.jpg' },
    { id: 8, name: 'Kyoto, Japão', imageUrl: 'https://wallpaper.dog/large/10951177.jpg' },
    { id: 9, name: 'Roma, Itália', imageUrl: 'https://romapravoce.com/wp-content/uploads/2021/04/torre-de-pisa-2.jpg' },
    { id: 10, name: 'Cairo, Egito', imageUrl: 'https://www.civitatis.com/blog/wp-content/uploads/2025/01/que-ver-cairo-egipto.jpg' },
    { id: 11, name: 'Machu Picchu, Peru', imageUrl: 'https://wallpaperaccess.com/full/652493.jpg' },
    { id: 12, name: 'Santorini, Grécia', imageUrl: 'https://www.melhoresdestinos.com.br/wp-content/uploads/2021/04/santorini-grecia-capa-1536x805.jpg' },
  ],
};

const suggestions = [
      { id: 19, name: 'Resorts All-Inclusive', imageUrl: 'https://tse1.mm.bing.net/th/id/OIP.qKlzYIhzomh_Eo5VZjAT5AHaFj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3' },
      { id: 20, name: 'Cruzeiros Marítimos', imageUrl: 'https://www.royalcaribbean.com/blog/wp-content/uploads/2022/06/RCI_OY_Cyprus_050421_MVerdure_Aerials_050_RET.jpg' },
      { id: 21, name: 'Viagens em Família', imageUrl: 'https://static.vecteezy.com/ti/fotos-gratis/p1/21607823-familia-com-carro-viagem-dirigindo-estrada-viagem-verao-periodo-de-ferias-dentro-carro-dentro-a-por-do-sol-pai-mae-e-filha-feliz-viajando-apreciar-feriados-e-relaxamento-juntos-pegue-a-atmosfera-e-ir-para-destino-foto.jpg' },
      { id: 22, name: 'Lua de Mel', imageUrl: 'https://th.bing.com/th/id/OIP.91vrI5Q0lewQKd5HHJmXKgHaE8?r=0&o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3' },
      { id: 23, name: 'Aventura', imageUrl: 'https://www.comparaonline.com.br/blog-statics/br/uploads/2020/01/Esporte-de-aventura-na-natureza.jpg' },
      { id: 24, name: 'Ecoturismo', imageUrl: 'https://blog.liberfly.com.br/wp-content/uploads/2023/01/ecoturismo-aventura.jpg' },
];

// Este é o componente que monta toda a seção de "Pacotes em Destaque" na home.
const FeaturedPackages = () => {
  // Eu uso este estado para guardar a cidade de partida selecionada no filtro.
  // Começa com 'Recife' por padrão.
  const [departureCity, setDepartureCity] = useState('Recife');

  // Criei esta função para simular a filtragem de pacotes.
  // Ela recebe uma cidade e retorna uma lista de pacotes "saindo" daquela cidade.
  // No futuro, isso será uma chamada real à minha API.
  const getPackagesByDeparture = (city) => {
    return [
      { id: 13, name: `Saindo de ${city} para o Caribe`, imageUrl: 'https://tse1.mm.bing.net/th/id/OIP.8-4XpoD9eUv0vnNZhlcfOwHaEH?r=0&rs=1&pid=ImgDetMain&o=7&rm=3' },
      { id: 14, name: `Saindo de ${city} para a Patagônia`, imageUrl: 'https://wallpaperaccess.com/full/981533.jpg' },
      { id: 15, name: `Saindo de ${city} para a Europa`, imageUrl: 'https://wallpapercave.com/wp/wp2840992.jpg' },
      { id: 16, name: 'Pacote A', imageUrl: 'https://source.unsplash.com/random/200x300?travel' },
      { id: 17, name: 'Pacote B', imageUrl: 'https://source.unsplash.com/random/200x301?travel' },
      { id: 18, name: 'Pacote C', imageUrl: 'https://source.unsplash.com/random/200x302?travel' },
    ];
  };

  return (
    <section className="featured-packages">
      <h2>Pacotes em Destaque</h2>
      <div className="columns-container">
        {/* Aqui eu reutilizo o componente 'PackageColumn' para cada categoria. */}
        <PackageColumn title="Pacotes Nacionais" packages={allPackages.nacionais} />
        <PackageColumn title="Pacotes Internacionais" packages={allPackages.internacionais} />
        
        {/*
          Para a coluna de "Saindo de:", eu passo o filtro de cidades como 'children' do componente.
          Assim, ele aparece no cabeçalho da coluna.
          A lista de pacotes ('packages') é o resultado da minha função de filtro.
        */}
        <PackageColumn title="Saindo de:" packages={getPackagesByDeparture(departureCity)}>
          <div className="departure-filter">
            <FaMapPin />
            <select value={departureCity} onChange={(e) => setDepartureCity(e.target.value)}>
              <option value="São Paulo">São Paulo</option>
              <option value="Rio de Janeiro">Rio de Janeiro</option>
              <option value="Recife">Recife</option>
              <option value="Belo Horizonte">Belo Horizonte</option>
            </select>
          </div>
        </PackageColumn>
        
        <PackageColumn title="Sugestões da Travel Agency" packages={suggestions} />
      </div>
    </section>
  );
};

export default FeaturedPackages;