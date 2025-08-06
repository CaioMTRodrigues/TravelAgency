import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPacoteById } from '../services/pacoteService';
// --- CORREÇÕES AQUI ---
import { cadastrarReserva } from '../services/reservaService';
import { listarViajantesDoUsuario, cadastrarViajante } from '../services/viajanteService';
import { vincularViajanteReserva } from '../services/reservationTravelerService';
// --- FIM DAS CORREÇÕES ---
import FormasPagamento from '../components/FormasPagamento';
import ModalViajante from '../components/ModalViajante';
import Spinner from '../components/Spinner';
import './CadastroReserva.css';

const CadastroReserva = () => {
    const { id_pacote } = useParams();
    const navigate = useNavigate();

    const [pacote, setPacote] = useState(null);
    const [viajantes, setViajantes] = useState([]);
    const [viajantesSelecionados, setViajantesSelecionados] = useState([]);
    const [reservaCriada, setReservaCriada] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [etapa, setEtapa] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const pacoteData = await getPacoteById(id_pacote);
                setPacote(pacoteData);

                // --- CORREÇÃO AQUI ---
                const viajantesData = await listarViajantesDoUsuario(); // Usando o nome correto
                setViajantes(viajantesData);
            } catch (err) {
                setError('Falha ao carregar dados. Tente novamente.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchInitialData();
    }, [id_pacote]);

    const handleViajanteChange = (viajanteId) => {
        setViajantesSelecionados(prev =>
            prev.includes(viajanteId)
                ? prev.filter(id => id !== viajanteId)
                : [...prev, viajanteId]
        );
    };

    const handleNovoViajante = async (novoViajante) => {
        try {
            // --- CORREÇÃO AQUI ---
            const viajanteAdicionado = await cadastrarViajante(novoViajante); // Usando o nome correto
            setViajantes(prev => [...prev, viajanteAdicionado]);
            setIsModalOpen(false);
        } catch (err) {
            console.error("Erro ao adicionar novo viajante:", err);
            setError("Não foi possível adicionar o viajante.");
        }
    };

    const handleConfirmarViajantes = async () => {
        if (viajantesSelecionados.length === 0) {
            setError("Selecione ao menos um viajante.");
            return;
        }
        setError('');
        setLoading(true);

        try {
            const dadosReserva = {
                id_Pacote: parseInt(id_pacote, 10),
                quantidade_Viajantes: viajantesSelecionados.length,
                valor_Total: pacote.preco * viajantesSelecionados.length,
            };

            // --- CORREÇÃO AQUI ---
            const novaReserva = await cadastrarReserva(dadosReserva); // Usando o nome correto
            setReservaCriada(novaReserva);

            for (const viajanteId of viajantesSelecionados) {
                // --- CORREÇÃO AQUI ---
                await vincularViajanteReserva({ // Usando o nome correto
                    id_Reserva: novaReserva.id_Reserva,
                    id_Viajante: viajanteId,
                });
            }

            setEtapa(2);
        } catch (err) {
            console.error("Erro ao criar reserva:", err);
            setError("Ocorreu um erro ao confirmar a reserva. Tente novamente.");
        } finally {
            setLoading(false);
        }
    };

    if (loading && !reservaCriada) {
        return <Spinner />;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    return (
        <div className="cadastro-reserva-container">
            {pacote && <h2>Reserva para: {pacote.nome}</h2>}

            {etapa === 1 && (
                <div className="etapa-viajantes">
                    <h3>Selecione os Viajantes</h3>
                    <div className="lista-viajantes">
                        {viajantes.map(v => (
                            <div key={v.id_Viajante} className="viajante-item">
                                <input
                                    type="checkbox"
                                    id={`viajante-${v.id_Viajante}`}
                                    checked={viajantesSelecionados.includes(v.id_Viajante)}
                                    onChange={() => handleViajanteChange(v.id_Viajante)}
                                />
                                <label htmlFor={`viajante-${v.id_Viajante}`}>{v.nome}</label>
                            </div>
                        ))}
                    </div>
                    <button onClick={() => setIsModalOpen(true)} className="btn-secondary">Adicionar Novo Viajante</button>
                    <button onClick={handleConfirmarViajantes} className="btn-primary" disabled={loading}>
                        {loading ? 'Processando...' : 'Confirmar Viajantes e Ir para Pagamento'}
                    </button>
                </div>
            )}

            {etapa === 2 && reservaCriada && (
                <div className="etapa-pagamento">
                    <h3>Resumo da Reserva</h3>
                    <p><strong>Pacote:</strong> {pacote.nome}</p>
                    <p><strong>Viajantes:</strong> {viajantesSelecionados.length}</p>
                    <p><strong>Valor Total:</strong> R$ {reservaCriada.valor_Total.toFixed(2)}</p>
                    <hr />
                    <FormasPagamento
                        reservationId={reservaCriada.id_Reserva}
                        onPaymentSuccess={() => console.log("Pagamento concluído com sucesso!")}
                    />
                </div>
            )}

            <ModalViajante
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleNovoViajante}
            />
        </div>
    );
};

export default CadastroReserva;