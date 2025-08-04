import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPacoteById } from '../services/pacoteService';
import { cadastrarReserva } from "../services/reservaService";
import { vincularViajanteReserva } from "../services/reservationTravelerService";
import Spinner from '../components/Spinner';
import ModalViajante from "../components/ModalViajante";
import './CadastroReserva.css';

const CadastroReserva = () => {
    const { id } = useParams(); // ID do pacote vindo da URL
    const navigate = useNavigate();
    const idUsuario = localStorage.getItem("idUsuario"); // Pega o ID do usuário logado

    // Estado para o pacote
    const [pacote, setPacote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Dados do formulário da reserva
    const [dadosReserva, setDadosReserva] = useState({
        nomeCompleto: '',
        email: '',
        telefone: '',
        numPessoas: 1,
    });
    
    // Estado para a lógica de acompanhantes
    const [mostrarModal, setMostrarModal] = useState(false);
    const [viajanteSelecionado, setViajanteSelecionado] = useState(null);

    // Efeito para buscar os detalhes do pacote
    useEffect(() => {
        const fetchPacoteDetails = async () => {
            if (!id) {
                setError('ID do pacote não fornecido.');
                setLoading(false);
                return;
            }
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
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDadosReserva(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!idUsuario) {
            setError("Você precisa estar logado para fazer uma reserva.");
            return;
        }

        try {
            const reservaCriada = await cadastrarReserva({
                id_Usuario: idUsuario,
                id_Pacote: parseInt(id),
                data_Reserva: new Date().toISOString(),
                // O status e número da reserva já são definidos no backend
            });

            if (viajanteSelecionado) {
                await vincularViajanteReserva(reservaCriada.id_Reserva, viajanteSelecionado.id_Viajante);
            }
            
            alert('Reserva enviada com sucesso!');
            navigate('/minhas-reservas');

        } catch (err) {
            setError(err.message || "Ocorreu um erro ao cadastrar a reserva.");
        }
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

                    <button type="button" onClick={() => setMostrarModal(true)}>
                        Adicionar Acompanhante
                    </button>
                    {viajanteSelecionado && <p>Acompanhante selecionado: {viajanteSelecionado.nome}</p>}

                    <div className="total-price">
                        Valor Total: <strong>R$ {(pacote.valor * dadosReserva.numPessoas).toFixed(2)}</strong>
                    </div>
                    <button type="submit" className="submit-button">Confirmar Reserva</button>
                </form>
            </div>
            
            {mostrarModal && (
                <ModalViajante
                    idUsuario={idUsuario}
                    onSelecionar={(v) => {
                        setViajanteSelecionado(v);
                        setMostrarModal(false);
                    }}
                    onFechar={() => setMostrarModal(false)}
                />
            )}
        </div>
    );
};

export default CadastroReserva;