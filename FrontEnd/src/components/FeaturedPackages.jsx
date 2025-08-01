import React from 'react';
import PackageRow from './PackageRow';
// Importei os ícones que vou usar nos títulos das fileiras.
import { FaPlane, FaGlobeAmericas, FaStar } from 'react-icons/fa';

// A minha função para gerar datas e preços aleatórios continua aqui.
const generateRandomPackageDetails = (basePrice) => {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(startDate.getDate() + 90);
  
  const randomDate = new Date(startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime()));
  const finalDate = new Date(randomDate);
  finalDate.setDate(randomDate.getDate() + 5);

  const formattedDate = `${randomDate.getDate().toString().padStart(2, '0')} de ${randomDate.toLocaleString('pt-BR', { month: 'short' })} - ${finalDate.getDate().toString().padStart(2, '0')} de ${finalDate.toLocaleString('pt-BR', { month: 'short' })}`;
  
  const randomPrice = basePrice + (Math.random() * 500 - 250);
  
  return { data: formattedDate, preco: Math.round(randomPrice) };
};

// Os dados dos pacotes com as informações geradas.
const allPackages = {
  nacionais: [
    { id: 1, nome: "Rio de Janeiro", imagem: "https://wallpaperaccess.com/full/125819.jpg", ...generateRandomPackageDetails(999) },
    { id: 2, nome: "Gramado", imagem: "https://gramadoinesquecivel.tur.br/img/gramado/img-gramado-5.jpg", ...generateRandomPackageDetails(1299) },
    { id: 4, nome: "Fernando de Noronha", imagem: "https://a.cdn-hotels.com/gdcs/production55/d458/fc74de3b-0bd1-4284-b53b-be71ba136901.jpg", ...generateRandomPackageDetails(2500) },
    { id: 5, nome: "Salvador", imagem: "https://tse4.mm.bing.net/th/id/OIP.EN61-JMFnY1gZWQz7-KZQgHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3", ...generateRandomPackageDetails(850) },
  ],
  internacionais: [
    { id: 3, nome: "Paris, França", imagem: "https://wallpaperaccess.com/full/296525.jpg", ...generateRandomPackageDetails(4999) },
    { id: 6, nome: "Tóquio, Japão", imagem: "https://wallpapercave.com/wp/wp8438159.jpg", ...generateRandomPackageDetails(6500) },
    { id: 7, nome: "Roma, Itália", imagem: "https://tse2.mm.bing.net/th/id/OIP.aRz4Gjf4Guxk8iRBfBXFWQHaEK?r=0&rs=1&pid=ImgDetMain&o=7&rm=3", ...generateRandomPackageDetails(4500) },
    { id: 8, nome: "Cancún, México", imagem: "https://tse4.mm.bing.net/th/id/OIP.MP9nZk52AVkhmKx2ZcfGyQHaEK?r=0&w=2560&h=1440&rs=1&pid=ImgDetMain&o=7&rm=3", ...generateRandomPackageDetails(3800) },
  ],
  sugestoes: [
      { id: 19, nome: 'Resorts All-Inclusive', imagem: 'https://tse1.mm.bing.net/th/id/OIP.qKlzYIhzomh_Eo5VZjAT5AHaFj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3', ...generateRandomPackageDetails(2200) },
      { id: 20, nome: 'Cruzeiros Marítimos', imagem: 'https://www.royalcaribbean.com/blog/wp-content/uploads/2022/06/RCI_OY_Cyprus_050421_MVerdure_Aerials_050_RET.jpg', ...generateRandomPackageDetails(3500) },
      { id: 21, nome: 'Viagens em Família', imagem: 'https://static.vecteezy.com/ti/fotos-gratis/p1/21607823-familia-com-carro-viagem-dirigindo-estrada-viagem-verao-periodo-de-ferias-dentro-carro-dentro-a-por-do-sol-pai-mae-e-filha-feliz-viajando-apreciar-feriados-e-relaxamento-juntos-pegue-a-atmosfera-e-ir-para-destino-foto.jpg', ...generateRandomPackageDetails(1800) },
      { id: 22, nome: 'Lua de Mel', imagem: 'https://th.bing.com/th/id/OIP.91vrI5Q0lewQKd5HHJmXKgHaE8?r=0&o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3', ...generateRandomPackageDetails(4000) },
  ]
};

const FeaturedPackages = () => {
  return (
    <div className="featured-packages-reloaded">
      {/* Agora eu passo o ícone correspondente para cada fileira de pacotes. */}
      <PackageRow title="Pacotes Nacionais" icon={<FaPlane />} packages={allPackages.nacionais} />
      <PackageRow title="Pacotes Internacionais" icon={<FaGlobeAmericas />} packages={allPackages.internacionais} reverse={true} />
      <PackageRow title="Sugestões da Travel Agency" icon={<FaStar />} packages={allPackages.sugestoes} />
    </div>
  );
};

export default FeaturedPackages;