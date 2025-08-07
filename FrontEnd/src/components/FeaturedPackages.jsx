import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDestaquePackages } from '../services/pacoteService'; 
import { getUserRole } from '../utils/authGuard';
import './FeaturedPackages.css';
import Spinner from './Spinner';

const FeaturedPackages = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const userRole = getUserRole();

  useEffect(() => {
    const fetchDestaques = async () => {
      try {
        const data = await getDestaquePackages(); 
        setPackages(data);
      } catch (error) {
        console.error('Erro ao carregar pacotes em destaque:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDestaques();
  }, []);

  const handleEdit = (packageId) => {
    navigate(`/admin/pacotes/editar/${packageId}`);
  };

  const handleDelete = async (packageId) => {
    if (window.confirm('Tem certeza que deseja excluir este pacote?')) {
      // Simulação da exclusão. A lógica real de API seria chamada aqui.
      console.log(`Pacote ${packageId} excluído!`);
      setPackages(packages.filter(p => p.id_Pacote !== packageId));
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="featured-packages">
      <h2 className="featured-title">Pacotes em Destaque</h2>
      <div className="packages-container">
        {Array.isArray(packages) && packages.length > 0 ? (
          packages.map((pacote) => (
            <div key={pacote.id_Pacote} className="package-card">
              <img 
                src={pacote.imagemUrl || 'https://placehold.co/600x400/005A9C/white?text=Destino'} 
                alt={pacote.titulo} 
                className="package-image"
              />
              <div className="package-info">
                <h3 className="package-name">{pacote.titulo}</h3>
                
                <p className="package-price">
                  {typeof pacote.valor === 'number'
                    ? `R$ ${pacote.valor.toFixed(2)}`
                    : 'Preço a consultar'}
                </p>
                <div className="package-actions">
                  {userRole === 'Admin' ? (
                    <>
                      <button className="btn-edit" onClick={() => handleEdit(pacote.id_Pacote)}>Editar</button>
                      <button className="btn-delete" onClick={() => handleDelete(pacote.id_Pacote)}>Excluir</button>
                    </>
                  ) : (
                    <button className="btn-details" onClick={() => navigate(`/pacotes/${pacote.id_Pacote}`)}>
                      Ver Detalhes
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="no-packages-message">Nenhum pacote em destaque no momento. Selecione até 6 pacotes no painel de gerenciamento.</p>
        )}
      </div>
    </div>
  );
};

export default FeaturedPackages;