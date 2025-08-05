import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Serviços e Componentes
import { getPacoteById } from '../services/pacoteService';
import { cadastrarReserva } from "../services/reservaService";
import { listarViajantesDoUsuario, cadastrarViajante, vincularViajanteReserva } from "../services/viajanteService";
import Spinner from '../components/Spinner';
import NovoViajanteForm from "../components/NovoViajanteForm";

// Ícones e Estilos
import { FaUser, FaPhone, FaUsers, FaTrash, FaLock, FaSearch, FaPlus, FaPlaneDeparture, FaQrcode } from 'react-icons/fa';
import './CadastroReserva.css';

const CadastroReserva = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const idUsuario = localStorage.getItem("idUsuario");

    // Estados do componente
    const [pacote, setPacote] = useState(null);
    const [error, setError] = useState('');
    const [dadosComprador, setDadosComprador] = useState({ nomeCompleto: '', telefone: '' });
    const [formErrors, setFormErrors] = useState({});
    const [saveData, setSaveData] = useState(true);

    // Estados dos acompanhantes e da busca
    const [acompanhantes, setAcompanhantes] = useState([]);
    const [viajantesDisponiveis, setViajantesDisponiveis] = useState([]);
    const [buscaAcompanhante, setBuscaAcompanhante] = useState('');
    const [mostrarFormNovoViajante, setMostrarFormNovoViajante] = useState(false);

    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        const savedData = localStorage.getItem(`compradorData_${idUsuario}`);
        if (savedData) {
            setDadosComprador(JSON.parse(savedData));
        }

        const fetchData = async () => {
            if (!id || !idUsuario) {
                setError('Informações de pacote ou usuário ausentes.');
                return;
            }
            try {
                const [pacoteData, viajantesData] = await Promise.all([
                    getPacoteById(id),
                    listarViajantesDoUsuario(idUsuario)
                ]);
                setPacote(pacoteData);
                setViajantesDisponiveis(viajantesData);
            } catch (err) {
                setError('Não foi possível carregar os dados. Tente novamente.');
            }
        };
        fetchData();
    }, [id, idUsuario]);

    const viajantesFiltrados = useMemo(() => {
        if (!buscaAcompanhante) return [];
        return viajantesDisponiveis
            .filter(v => v.nome.toLowerCase().includes(buscaAcompanhante.toLowerCase()))
            .slice(0, 5);
    }, [buscaAcompanhante, viajantesDisponiveis]);

    const handleAdicionarAcompanhante = (viajante) => {
        if (!acompanhantes.some(a => a.id_Viajante === viajante.id_Viajante)) {
            setAcompanhantes([...acompanhantes, viajante]);
            setViajantesDisponiveis(viajantesDisponiveis.filter(v => v.id_Viajante !== viajante.id_Viajante));
            setBuscaAcompanhante('');
        }
    };

    const handleRemoverAcompanhante = (viajante) => {
        setAcompanhantes(acompanhantes.filter(a => a.id_Viajante !== viajante.id_Viajante));
        setViajantesDisponiveis(prev => [...prev, viajante].sort((a,b) => a.nome.localeCompare(b.nome)));
    };

    const handleNovoAcompanhanteCadastrado = async (novoViajante) => {
        try {
            const viajanteCadastrado = await cadastrarViajante(novoViajante);
            handleAdicionarAcompanhante(viajanteCadastrado);
            setMostrarFormNovoViajante(false);
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || "Erro ao cadastrar novo acompanhante.";
            console.error(errorMessage);
        }
    };

    const validateField = (name, value) => {
        if (name === "nomeCompleto" && !value) return "O nome completo é obrigatório.";
        if (name === "telefone" && value.replace(/\D/g, '').length < 10) return "O telefone parece estar incompleto.";
        return "";
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDadosComprador(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const nomeError = validateField("nomeCompleto", dadosComprador.nomeCompleto);
        const telefoneError = validateField("telefone", dadosComprador.telefone);
        if (nomeError || telefoneError) {
            setFormErrors({ nomeCompleto: nomeError, telefone: telefoneError });
            return;
        }

        setIsProcessing(true);

        if (saveData) {
            localStorage.setItem(`compradorData_${idUsuario}`, JSON.stringify(dadosComprador));
        } else {
            localStorage.removeItem(`compradorData_${idUsuario}`);
        }

        try {
            const reservaCriada = await cadastrarReserva({
                id_Usuario: idUsuario,
                id_Pacote: parseInt(id),
                data_Reserva: new Date().toISOString(),
                status: 'Pendente'
            });

            if (acompanhantes.length > 0) {
                await Promise.all(acompanhantes.map(v => vincularViajanteReserva(reservaCriada.id_Reserva, v.id_Viajante)));
            }
            
            // Simulação de redirecionamento para pagamento (ou outra página)
            alert("Reserva confirmada! Redirecionando para a próxima etapa.");
            navigate('/minhas-reservas'); // Ou para a página de pagamento no futuro

        } catch (err) {
            setError(err.message || "Ocorreu um erro ao processar sua reserva.");
            setIsProcessing(false);
        }
    };

    if (error) return <div className="error-message-full-page">{error}</div>;
    if (!pacote) return <Spinner />;

    return (
        <div className="cadastro-reserva-container">
            <div className="reserva-coluna-esquerda">
                <form id="reserva-form" onSubmit={handleSubmit} noValidate>
                    <div className="card-form">
                        <h2><FaUser /> Dados do Titular</h2>
                        <div className="form-group">
                            <label htmlFor="nomeCompleto">Nome Completo</label>
                            <input type="text" id="nomeCompleto" name="nomeCompleto" value={dadosComprador.nomeCompleto} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="telefone">Telefone</label>
                            <input type="tel" id="telefone" name="telefone" placeholder="(xx) xxxxx-xxxx" value={dadosComprador.telefone} onChange={handleChange} required />
                        </div>
                        <div className="form-group-checkbox">
                            <input type="checkbox" id="saveData" checked={saveData} onChange={(e) => setSaveData(e.target.checked)} />
                            <label htmlFor="saveData">Salvar dados para a próxima compra</label>
                        </div>
                    </div>

                    <div className="card-form">
                        <h2><FaUsers /> Acompanhantes</h2>
                        <div className="acompanhantes-busca-container">
                             <div className="busca-input-wrapper">
                                <FaSearch className="busca-icon" />
                                <input type="text" placeholder="Buscar acompanhante salvo..." value={buscaAcompanhante} onChange={(e) => setBuscaAcompanhante(e.target.value)} />
                            </div>
                            {viajantesFiltrados.length > 0 && (
                                <div className="busca-resultados">
                                    {viajantesFiltrados.map(v => ( <div key={v.id_Viajante} className="resultado-item" onClick={() => handleAdicionarAcompanhante(v)}>{v.nome}</div> ))}
                                </div>
                            )}
                        </div>
                        <button type="button" className="btn-novo-viajante" onClick={() => setMostrarFormNovoViajante(true)}>
                            <FaPlus /> Cadastrar Novo Viajante
                        </button>
                    </div>
                </form>
            </div>

            <div className="reserva-coluna-direita">
                <div className="ticket-summary">
                    <div className="ticket-header">
                        <FaPlaneDeparture />
                        <h4>Voucher da sua Viagem</h4>
                    </div>
                    <div className="ticket-body">
                        <img src={pacote.imagemUrl} alt={pacote.titulo} className="ticket-imagem" />
                        <h3>{pacote.titulo}</h3>
                        <p className="ticket-destino">{pacote.destino}</p>

                        <div className="ticket-section">
                            <h4>Viajantes</h4>
                            <div className="viajantes-list">
                                <p><FaUser /> {dadosComprador.nomeCompleto || "Nome do Titular"}</p>
                                {acompanhantes.map(v => <p key={v.id_Viajante}><FaUser /> {v.nome}</p>)}
                            </div>
                        </div>

                        <div className="ticket-section">
                            <h4>Resumo de Custos</h4>
                            <div className="summary-detalhe">
                                <span>{1 + acompanhantes.length} Viajante(s) x R$ {pacote.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                                <strong>R$ {(pacote.valor * (1 + acompanhantes.length)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                            </div>
                        </div>

                        <div className="ticket-total">
                            <span>Valor Total</span>
                            <strong>R$ {(pacote.valor * (1 + acompanhantes.length)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                        </div>
                    </div>
                    <div className="ticket-footer">
                        <div className="qr-placeholder">
                            <FaQrcode />
                        </div>
                        <p>Este é um resumo da sua viagem. A confirmação ocorrerá após o pagamento.</p>
                    </div>
                </div>

                <button type="submit" form="reserva-form" className="submit-button" disabled={isProcessing}>
                    {isProcessing ? <Spinner /> : 'Seguir para Pagamento'}
                </button>
                <div className="secure-payment-info">
                    <FaLock />
                    <span>Ambiente de Pagamento 100% Seguro</span>
                </div>
            </div>

            {mostrarFormNovoViajante && (
                <NovoViajanteForm
                    idUsuario={idUsuario}
                    onCadastrar={handleNovoAcompanhanteCadastrado}
                    onCancelar={() => setMostrarFormNovoViajante(false)}
                />
            )}
        </div>
    );
};

export default CadastroReserva;