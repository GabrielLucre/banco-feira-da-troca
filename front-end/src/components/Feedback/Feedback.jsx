import axios from 'axios';
import { useEffect, useState } from "react";

import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import CircularProgress from '@mui/material/CircularProgress';

import Alerta from "../Alerta/Alerta";

import "./Feedback.css";

const Review = () => {
    const [formData, setFormData] = useState({});
    const [openSuccess, setOpenSuccess] = useState(false);
    const [openError, setOpenError] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;
        const updatedData = {
            ...formData,
            [name]: value,
        };

        sessionStorage.setItem('formData', JSON.stringify(updatedData));

        setFormData(updatedData);
    };

    useEffect(() => {
        const savedData = sessionStorage.getItem('formData');
        if (savedData) {
            setFormData(JSON.parse(savedData));
        }
    }, []);

    const [disable, setDisable] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault();
        setDisable(true)

        const values = {
            experiencia: formData.experiencia,
            facilidade_troca: formData.facilidade_troca,
            atendeu_expectativas: formData.atendeu_expectativas,
            facilidade_interface: formData.facilidade_interface,
            problema_tecnico: formData.problema_tecnico || "",
            funcionalidades_sugeridas: formData.funcionalidades_sugeridas || "",
            entrega_eficiente: formData.entrega_eficiente,
            problema_troca: formData.problema_troca || "",
            comanda_clara: formData.comanda_clara,
            saldo_transacoes: formData.saldo_transacoes,
            melhorias_sugeridas: formData.melhorias_sugeridas,
            novamante: formData.novamante
        };

        try {
            const response = await axios.post('http://localhost:3000/submit-form', values);
            console.log('Response:', response);
            setDisable(false)
            setOpenSuccess(true);
            setFormData({});
            sessionStorage.removeItem('formData');
        } catch (error) {
            console.error("Erro ao enviar feedback: ", error);
            setDisable(false)
            setOpenError(true);
        }
    };

    const handleCloseBackdropButton = () => {
        setOpenSuccess(false)
        setOpenError(false)
    }

    return (
        <div className="content-review">
            <div className="form-container">
                <h1>Feedback Projeto Banco Feira da Troca🏦💸</h1>
                <form onSubmit={handleSubmit}>
                    <label>Como você avalia sua experiência na Feira da Troca? <span className="required-review">*</span></label>
                    <div className="box-form-review">
                        <div className="answer-review">
                            {["1 - Muito Ruim", "2 - Ruim", "3 - Boa", "4 - Muito Boa", "5 - Excelente"].map((option) => (
                                <label key={option} className="box-option">
                                    <Radio
                                        disabled={disable}
                                        name="experiencia"
                                        value={option}
                                        required
                                        onChange={handleChange}
                                        checked={formData.experiencia === option}
                                        sx={{
                                            '& .MuiSvgIcon-root': {
                                                fontSize: 14,
                                            },
                                        }}
                                        style={{ color: 'var(--third-color)', }}
                                        color="var(--third-color)"
                                    />
                                    <p>{option}</p>
                                </label>
                            ))}
                        </div>
                    </div>

                    <label>Você encontrou facilidade para participar das trocas de produtos? <span className="required-review">*</span></label>
                    <div className="box-form-review">
                        <div className="answer-review">
                            {["Sim", "Não", "Parcialmente"].map((option) => (
                                <label key={option} className="box-option">
                                    <Radio
                                        disabled={disable}
                                        name="facilidade_troca"
                                        value={option}
                                        required
                                        onChange={handleChange}
                                        checked={formData.facilidade_troca === option}
                                        sx={{
                                            '& .MuiSvgIcon-root': {
                                                fontSize: 14,
                                            },
                                        }}
                                        style={{ color: 'var(--third-color)', }}
                                        color="var(--third-color)"
                                    />
                                    <p>{option}</p>
                                </label>
                            ))}
                        </div>
                    </div>

                    <label>O evento atendeu às suas expectativas? <span className="required-review">*</span></label>
                    <div className="box-form-review">
                        <div className="answer-review">
                            {["Sim", "Não"].map((option) => (
                                <label key={option} className="box-option">
                                    <Radio
                                        disabled={disable}
                                        name="atendeu_expectativas"
                                        value={option}
                                        required
                                        onChange={handleChange}
                                        checked={formData.atendeu_expectativas === option}
                                        sx={{
                                            '& .MuiSvgIcon-root': {
                                                fontSize: 14,
                                            },
                                        }}
                                        style={{ color: 'var(--third-color)', }}
                                        color="var(--third-color)"
                                    />
                                    <p>{option}</p>
                                </label>
                            ))}
                        </div>
                    </div>

                    <label>A interface do sistema de trocas foi fácil de usar? <span className="required-review">*</span></label>
                    <div className="box-form-review">
                        <div className="answer-review">
                            {["Sim", "Não", "Parcialmente"].map((option) => (
                                <label key={option} className="box-option">
                                    <Radio
                                        disabled={disable}
                                        name="facilidade_interface"
                                        value={option}
                                        required
                                        onChange={handleChange}
                                        checked={formData.facilidade_interface === option}
                                        sx={{
                                            '& .MuiSvgIcon-root': {
                                                fontSize: 14,
                                            },
                                        }}
                                        style={{ color: 'var(--third-color)', }}
                                        color="var(--third-color)"
                                    />
                                    <p>{option}</p>
                                </label>
                            ))}
                        </div>
                    </div>


                    <label>Houve algum problema técnico durante o uso? Se sim, descreva.</label>
                    <div className="open-answer-review">
                        <textarea
                            disabled={disable}
                            name="problema_tecnico"
                            rows="6"
                            value={formData.problema_tecnico || ""}
                            onChange={handleChange}
                        />
                    </div>


                    <label>Que funcionalidades você gostaria que fossem adicionadas ao sistema?</label>
                    <div className="open-answer-review">
                        <textarea
                            disabled={disable}
                            name="funcionalidades_sugeridas"
                            rows="6"
                            value={formData.funcionalidades_sugeridas || ""}
                            onChange={handleChange}
                        />
                    </div>

                    <label>A entrega digital de produtos foi eficiente? <span className="required-review">*</span></label>
                    <div className="box-form-review">
                        <div className="answer-review">
                            {["Sim", "Não", "Parcialmente"].map((option) => (
                                <label key={option} className="box-option">
                                    <Radio
                                        disabled={disable}
                                        name="entrega_eficiente"
                                        value={option}
                                        required
                                        onChange={handleChange}
                                        checked={formData.entrega_eficiente === option}
                                        sx={{
                                            '& .MuiSvgIcon-root': {
                                                fontSize: 14,
                                            },
                                        }}
                                        style={{ color: 'var(--third-color)', }}
                                        color="var(--third-color)"
                                    />
                                    <p>{option}</p>
                                </label>
                            ))}
                        </div>
                    </div>


                    <label>Houve algum problema nas trocas de produtos? Se sim, qual?</label>
                    <div className="open-answer-review">
                        <textarea
                            disabled={disable}
                            name="problema_troca"
                            rows="6"
                            value={formData.problema_troca || ""}
                            onChange={handleChange}
                        />
                    </div>

                    <label>O uso da comanda funcionou de forma clara? <span className="required-review">*</span></label>
                    <div className="box-form-review">
                        <div className="answer-review">
                            {["Sim", "Não"].map((option) => (
                                <label key={option} className="box-option">
                                    <Radio
                                        disabled={disable}
                                        name="comanda_clara"
                                        value={option}
                                        required
                                        onChange={handleChange}
                                        checked={formData.comanda_clara === option}
                                        sx={{
                                            '& .MuiSvgIcon-root': {
                                                fontSize: 14,
                                            },
                                        }}
                                        style={{ color: 'var(--third-color)', }}
                                        color="var(--third-color)"
                                    />
                                    <p>{option}</p>
                                </label>
                            ))}
                        </div>
                    </div>

                    <label>Alguma dificuldade para entender o saldo disponível e as transações? <span className="required-review">*</span></label>
                    <div className="box-form-review">
                        <div className="answer-review">
                            {["Sim", "Não", "Parcialmente"].map((option) => (
                                <label key={option} className="box-option">
                                    <Radio
                                        disabled={disable}
                                        name="saldo_transacoes"
                                        value={option}
                                        required
                                        onChange={handleChange}
                                        checked={formData.saldo_transacoes === option}
                                        sx={{
                                            '& .MuiSvgIcon-root': {
                                                fontSize: 14,
                                            },
                                        }}
                                        style={{ color: 'var(--third-color)', }}
                                        color="var(--third-color)"
                                    />
                                    <p>{option}</p>
                                </label>
                            ))}
                        </div>
                    </div>


                    <label>O que você sugeriria para melhorar futuras edições da Feira da Troca? <span className="required-review">*</span></label>
                    <div className="open-answer-review">
                        <textarea
                            disabled={disable}
                            name="melhorias_sugeridas"
                            rows="6"
                            required
                            value={formData.melhorias_sugeridas || ""}
                            onChange={handleChange}
                        />
                    </div>

                    <label>Você participaria novamente? <span className="required-review">*</span></label>
                    <div className="box-form-review">
                        <div className="answer-review">
                            {["Sim", "Talvez", "Não"].map((option) => (
                                <label key={option} className="box-option">
                                    <Radio
                                        disabled={disable}
                                        name="novamante"
                                        value={option}
                                        required
                                        onChange={handleChange}
                                        checked={formData.novamante === option}
                                        sx={{
                                            '& .MuiSvgIcon-root': {
                                                fontSize: 14,
                                            },
                                        }}
                                        style={{ color: 'var(--third-color)', }}
                                        color="var(--third-color)"
                                    />
                                    <p>{option}</p>
                                </label>
                            ))}
                        </div>
                    </div>

                    <Button type="submit" variant="contained" disabled={disable} sx={{ textTransform: 'none' }} style={{ backgroundColor: 'var(--third-color)', }} >Enviar Feedback</Button>
                </form >
            </div >
            <div className='loading-feedback'>
                {disable && <CircularProgress sx={{ color: 'var(--third-color)' }} />}
            </div>
            <div onClick={(e) => e.stopPropagation()}>
                <Alerta state={openSuccess} onClose={handleCloseBackdropButton} text="Feedback enviado com sucesso! Obrigado." severity="success" />
            </div>
            <div onClick={(e) => e.stopPropagation()}>
                <Alerta state={openError} onClose={handleCloseBackdropButton} text="Erro ao enviar o feedback." severity="error" />
            </div>
        </div >
    );
};

export default Review;