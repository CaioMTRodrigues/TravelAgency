import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// CORREÇÃO: Importamos a nova função para buscar um pacote por ID.
import { getPacoteById } from '../services/pacoteService'; 
import Spinner from '../components/Spinner';
import './CadastroReserva.css'; // Usaremos um CSS para estilizar a página

const CadastroReserva = () => {
    const { id } = useParams(); // Pega o ID do pacote da URL
    const navigate = useNavigate();

    const [pacote, setPacote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Dados do formulário
    const [dadosReserva, setDadosReserva] = useState({
        nomeCompleto: '',
        email: '',
        telefone: '',
        numPessoas: 1,
    });

    useEffect(() => {
        const fetchPacoteDetails = async () => {
            if (!id) return;
            try {
                const data = await getPacoteById(id);
                setPacote(data);
            } catch (err) {
                setError('Não foi possível carregar os detalhes do pacote. Por favor, tente novamente.');
            } finally {
                setLoading(false);
            }
        };

        fetchPacoteDetails();
    }, [id]); // Roda sempre que o ID na URL mudar

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDadosReserva(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aqui viria a lógica para enviar os dados da reserva para a API
        console.log("Dados da reserva a serem enviados:", { id_pacote: id, ...dadosReserva });
        alert('Reserva enviada com sucesso! (Simulação)');
        navigate('/minhas-reservas');
    };

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return <div className="error-message-full-page">{error}</div>;
    }

    if (!pacote) {
        return <div className="error-message-full-page">Pacote não encontrado.</div>;
    }

    return (
        <div className="cadastro-reserva-container">
            <div className="reserva-summary">
                <h2>Resumo do Pacote</h2>
                <img src={pacote.imagemUrl || 'https://placehold.co/600x400/005A9C/white?text=Destino'} alt={pacote.titulo} />
                <h3>{pacote.titulo}</h3>
                <p>{pacote.destino}</p>
                <p className="price">Valor por pessoa: <strong>R$ {pacote.valor.toFixed(2)}</strong></p>
                <p><strong>Duração:</strong> {pacote.duracaoDias} dias</p>
            </div>
            <div className="reserva-form-container">
                <h2>Complete sua Reserva</h2>
                <form onSubmit={handleSubmit} className="reserva-form">
                    <div className="form-group">
                        <label>Nome Completo</label>
                        <input type="text" name="nomeCompleto" value={dadosReserva.nomeCompleto} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" name="email" value={dadosReserva.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Telefone</label>
                        <input type="tel" name="telefone" value={dadosReserva.telefone} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Número de Viajantes</label>
                        <input type="number" name="numPessoas" value={dadosReserva.numPessoas} onChange={handleChange} min="1" required />
                    </div>
                    <div className="total-price">
                        Valor Total: <strong>R$ {(pacote.valor * dadosReserva.numPessoas).toFixed(2)}</strong>
                    </div>
                    <button type="submit" className="submit-button">Confirmar Reserva</button>
                </form>
            </div>
        </div>
    );
};

export default CadastroReserva;
