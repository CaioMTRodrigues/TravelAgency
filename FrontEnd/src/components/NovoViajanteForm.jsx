import React, { useState } from 'react';
import './NovoViajanteForm.css';

const NovoViajanteForm = ({ idUsuario, onCadastrar, onCancelar }) => {
    const [novoViajante, setNovoViajante] = useState({
        id_Usuario: idUsuario,
        nome: '',
        cpf: '',
        passaporte: '',
        data_Nascimento: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNovoViajante(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!novoViajante.nome || !novoViajante.data_Nascimento || (!novoViajante.cpf && !novoViajante.passaporte)) {
            setError('Preencha ao menos o nome, data de nascimento e um documento.');
            return;
        }
        setError('');
        // A função onCadastrar vem do componente pai (CadastroReserva)
        await onCadastrar(novoViajante); 
    };

    return (
        <div className="novo-viajante-form-overlay">
            <div className="novo-viajante-form">
                <h3>Cadastrar Novo Viajante</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group-inline">
                        <label>Nome Completo</label>
                        <input
                            type="text"
                            name="nome"
                            value={novoViajante.nome}
                            onChange={handleChange}
                            placeholder="Nome como no documento"
                            required
                        />
                    </div>
                    <div className="form-row">
                        <div className="form-group-inline">
                            <label>Data de Nascimento</label>
                            <input
                                type="date"
                                name="data_Nascimento"
                                value={novoViajante.data_Nascimento}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group-inline">
                            <label>CPF</label>
                            <input
                                type="text"
                                name="cpf"
                                value={novoViajante.cpf}
                                onChange={handleChange}
                                placeholder="Apenas números"
                            />
                        </div>
                    </div>
                     <div className="form-group-inline">
                        <label>Passaporte (opcional)</label>
                        <input
                            type="text"
                            name="passaporte"
                            value={novoViajante.passaporte}
                            onChange={handleChange}
                        />
                    </div>
                    {error && <p className="error-message-inline">{error}</p>}
                    <div className="form-actions">
                        <button type="button" onClick={onCancelar} className="btn-cancelar">Cancelar</button>
                        <button type="submit" className="btn-salvar">Salvar Viajante</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default NovoViajanteForm;