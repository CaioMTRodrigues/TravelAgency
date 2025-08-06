import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { InputMask } from '@react-input/mask';

// Serviços e Componentes
import { getPacoteById } from '../services/pacoteService';
import { cadastrarReserva } from "../services/reservaService";
import { listarViajantesDoUsuario, cadastrarViajante, vincularViajanteReserva } from "../services/viajanteService";
import { createPayPalOrder as createCheckoutSession } from '../services/paymentService';

import Spinner from '../components/Spinner';
import ModalViajante from "../components/ModalViajante";

// Ícones e Estilos
import { FaUser, FaPhone, FaUsers, FaPlusCircle, FaTrash, FaLock } from 'react-icons/fa';
import './CadastroReserva.css';

const CadastroReserva = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const idUsuario = localStorage.getItem("idUsuario");

    // Estados do componente
    const [pacote, setPacote] = useState(null);
    const [error, setError] = useState('');
    
    // Estados do formulário e validação
    const [dadosComprador, setDadosComprador] = useState({ nomeCompleto: '', telefone: '' });
    const [formErrors, setFormErrors] = useState({});
    const [saveData, setSaveData] = useState(true);

    // Estados dos acompanhantes e modal
    const [acompanhantes, setAcompanhantes] = useState([]);
    const [viajantesDisponiveis, setViajantesDisponiveis] = useState([]);
    const [mostrarModal, setMostrarModal] = useState(false); // <-- Variável correta
    
    // Estado de Carregamento para o botão
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

    const validateField = (name, value) => {
        if (name === "nomeCompleto" && !value) {
            return "O nome completo é obrigatório.";
        }
        if (name === "telefone" && value.replace(/[\s_()-]/g, '').length < 11) {
            return "O telefone parece estar incompleto.";
        }
        return "";
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setFormErrors(prevErrors => ({
            ...prevErrors,
            [name]: validateField(name, value)
        }));
    };
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setDadosComprador(prevState => ({ ...prevState, [name]: value }));
        if (formErrors[name]) {
            setFormErrors(prevErrors => ({
                ...prevErrors,
                [name]: validateField(name, value)
            }));
        }
    };
    
    // Lógica de Acompanhantes
    const adicionarAcompanhante = (viajante) => {
        if (!acompanhantes.some(a => a.id_Viajante === viajante.id_Viajante) && acompanhantes.length < 9) {
            setAcompanhantes([...acompanhantes, viajante]);
            setViajantesDisponiveis(viajantesDisponiveis.filter(v => v.id_Viajante !== viajante.id_Viajante));
        }
    };
    
    const removerAcompanhante = (viajante) => {
        setAcompanhantes(acompanhantes.filter(a => a.id_Viajante !== viajante.id_Viajante));
        setViajantesDisponiveis(prev => [...prev, viajante].sort((a,b) => a.nome.localeCompare(b.nome)));
    };

    const handleNovoAcompanhante = async (novoViajante) => {
        try {
            const viajanteCadastrado = await cadastrarViajante(novoViajante);
            setViajantesDisponiveis(prev => [...prev, viajanteCadastrado].sort((a,b) => a.nome.localeCompare(b.nome)));
            adicionarAcompanhante(viajanteCadastrado);
            setMostrarModal(false);
        } catch (err) {
            setError(err.message || "Erro ao cadastrar novo acompanhante.");
        }
    };

    // Submissão do Formulário
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

  await Promise.all(acompanhantes.map(v =>
    vincularViajanteReserva(reservaCriada.id_Reserva, v.id_Viajante)
  ));

  const checkoutData = {
    idReserva: reservaCriada.id_Reserva,
    nomePacote: pacote.titulo,
    valorUnitario: pacote.valor,
    quantidade: 1 + acompanhantes.length,
    idPacote: pacote.id_Pacote
  };

  // Aqui você pode redirecionar para uma página de confirmação ou pagamento
  setIsProcessing(false);
  
const { orderId } = await createCheckoutSession(checkoutData);
window.location.href = `https://www.paypal.com/checkoutnow?token=${orderId}`;


} catch (err) {
  setError(err.message || "Ocorreu um erro ao processar sua reserva.");
  setIsProcessing(false);
}

    };
    
    if (!pacote) return <div>Carregando pacote...</div>;

    if (error && !isProcessing) return <div className="error-message-full-page">{error}</div>;

    return (
        <div className="cadastro-reserva-container">
            <div className="reserva-coluna-esquerda">
                <h2>Dados do Comprador</h2>
                <form id="reserva-form" onSubmit={handleSubmit} noValidate>
                    <div className="form-group">
                        <label htmlFor="nomeCompleto"><FaUser /> Nome Completo</label>
                        <input
                            type="text"
                            id="nomeCompleto"
                            name="nomeCompleto"
                            placeholder="Seu nome como no documento"
                            value={dadosComprador.nomeCompleto}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={formErrors.nomeCompleto ? 'input-error' : ''}
                            required
                        />
                        {formErrors.nomeCompleto && <span className="error-message">{formErrors.nomeCompleto}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="telefone"><FaPhone /> Telefone de Contato</label>
                        <InputMask
                            component="input"
                            mask="(__) _____-____"
                            replacement={{ _: /\d/ }}
                            id="telefone"
                            name="telefone"
                            placeholder="(xx) xxxxx-xxxx"
                            value={dadosComprador.telefone}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={formErrors.telefone ? 'input-error' : ''}
                            required
                        />
                        {formErrors.telefone && <span className="error-message">{formErrors.telefone}</span>}
                    </div>
                    <div className="form-group-checkbox">
                        <input 
                            type="checkbox" 
                            id="saveData" 
                            checked={saveData} 
                            onChange={(e) => setSaveData(e.target.checked)}
                        />
                        <label htmlFor="saveData">Salvar meus dados para a próxima compra</label>
                    </div>
                </form>

                <h2 style={{ marginTop: '40px' }}><FaUsers /> Acompanhantes</h2>
                <div className="acompanhantes-container">
                    {acompanhantes.map(viajante => (
                        <div key={viajante.id_Viajante} className="acompanhante-tag">
                            <span>{viajante.nome}</span>
                            <button onClick={() => removerAcompanhante(viajante)} className="remove-btn"><FaTrash /></button>
                        </div>
                    ))}
                     <div className="dropdown-acompanhantes">
                        <button className="add-button">
                           <FaPlusCircle /> Adicionar Acompanhante
                        </button>
                        <div className="dropdown-content">
                            {viajantesDisponiveis.length > 0 ? (
                                viajantesDisponiveis.map(v => (
                                    <a key={v.id_Viajante} onClick={() => adicionarAcompanhante(v)}>{v.nome}</a>
                                ))
                            ) : (
                                <span className="dropdown-empty">Nenhum acompanhante salvo.</span>
                            )}
                            <a onClick={() => setMostrarModal(true)} className="dropdown-action">+ Cadastrar Novo</a>
                        </div>
                    </div>
                </div>
            </div>

            <div className="reserva-coluna-direita">
                <div className="reserva-summary">
                    <img src={pacote.imagemUrl} alt={pacote.titulo} className="summary-imagem" />
                    <h3>{pacote.titulo}</h3>
                    <p>{pacote.destino}</p>
                    <hr />
                    <div className="summary-detalhe">
                        <span>Valor por pessoa</span>
                        <strong>R$ {pacote.valor.toFixed(2)}</strong>
                    </div>
                    <div className="summary-detalhe">
                        <span>Viajantes</span>
                        <strong>{1 + acompanhantes.length}</strong>
                    </div>
                    <hr />
                    <div className="summary-total">
                        <span>Valor Total</span>
                        <strong>R$ {(pacote.valor * (1 + acompanhantes.length)).toFixed(2)}</strong>
                    </div>
                    <button type="submit" form="reserva-form" className="submit-button" disabled={isProcessing}>
                        {isProcessing ? (
                            <><div className="spinner-sm"></div> Processando...</>
                        ) : (
                            'Seguir para Pagamento'
                        )}
                    </button>
                    <div className="secure-payment-info">
                        <FaLock />
                        <span>Você será redirecionado para um ambiente de pagamento seguro.</span>
                    </div>
                </div>
            </div>
            
            {/* ================================================================== */}
            {/* >> CORREÇÃO APLICADA AQUI << */}
            {mostrarModal && (
                <ModalViajante
                    idUsuario={idUsuario}
                    onSelecionar={adicionarAcompanhante}
                    onCadastrar={handleNovoAcompanhante}
                    onFechar={() => setMostrarModal(false)}
                />
            )}
            {/* ================================================================== */}
        </div>
    );
};

export default CadastroReserva;