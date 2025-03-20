/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import axios from 'axios'
import { doc, increment, updateDoc } from "firebase/firestore"
import { useState, useRef } from "react"
import { dbComandas } from '../../lib/firebaseConfig.js'

import SendRoundedIcon from '@mui/icons-material/SendRounded'
import Autocomplete from "@mui/material/Autocomplete"
import Button from '@mui/material/Button'
import TextField from "@mui/material/TextField"

import Alerta from '../Alerta/Alerta.jsx'
import ConfirmDate from '../ConfirmDate/ConfirmDate.jsx'

import "../FormProduct/FormProduct.css"
import '../FormUser/FormUser.css'

export default function FormUserSealing({ total, setTotal, carrinho, setCarrinho }) {
    const [stateReadComanda, setStateReadComanda] = useState(false)
    const [stateLoading, setStateLoading] = useState(false)
    const [openAlertCart, setOpenAlertCart] = useState(false)
    const [openAlertAdd, setOpenAlertAdd] = useState(false)
    const [openAlertMoney, setOpenAlertMoney] = useState(false)
    const [openAlertBalance, setOpenAlertBalance] = useState(false)
    const [openAlertSell, setOpenAlertSell] = useState(false)
    const [comandas, setComandas] = useState([])
    const [openDate, setOpenDate] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (dados.saldo < total * -1) {
            setOpenAlertMoney(true)
            return
        }

        try {
            const carrinho = JSON.parse(localStorage.getItem("carrinho"));
            if (!carrinho || carrinho.length === 0) {
                setOpenAlertCart(true)
                return
            }

            const ids = carrinho.map(id => id.produtoID);
            const produtos = carrinho
                .filter(produto => produto.nomeProduto && produto.valorProduto && produto.subcategoriaID)
                .map(produto => ({
                    nome: produto.nomeProduto,
                    valor: produto.valorProduto,
                    subcategoria: produto.subcategoriaID
                }));

            const response = await axios.put("http://localhost:3000/stock/edit", {
                ids: ids.flat(),
                produtos: produtos,
                comandaId: dados.id,
                tipo: "Saida"
            })

            if (!response.status === 200) {
                console.error("Erro ao vender produtos no MySQL.")
                return
            }

            if (total >= 0) {
                setOpenAlertBalance(true)
                return
            }

            const comandaRef = doc(dbComandas, "comandas", dados.id)

            await updateDoc(comandaRef, {
                saldo: increment(total),
            });

            setOpenAlertAdd(true)
        } catch (error) {
            console.error("Erro ao processar a venda:", error)
            setOpenAlertSell(true)
        }
    }

    const readComandas = async () => {
        setStateLoading(true)
        try {
            if (!stateReadComanda) {
                const response = await axios.get('http://localhost:3000/comandas/get')
                const cArray = []

                response.data.forEach((doc) => {
                    if (doc.ativo) {
                        cArray.push(doc)
                    }
                })

                setStateReadComanda(true)
                setComandas(cArray)
            }

            setStateLoading(false)
        } catch (err) {
            setStateLoading(false)
            console.error(err)
        }
    }

    const handleChange = (e) => {
        const { name, value } = e.target
        setDados({
            ...dados,
            [name]: value,
        })
    }

    const [dados, setDados] = useState({
        id: "",
        nome: "",
        saldo: "",
        data: ""
    })

    const handleCloseBackdropButton = () => {
        if (openAlertAdd) {
            setOpenAlertAdd(false)
            localStorage.removeItem("carrinho")
            setCarrinho([])
            window.location.href = "/venda"
        }

        setOpenAlertMoney(false)
        setOpenAlertBalance(false)
        setOpenAlertCart(false)
        setOpenAlertSell(false)
    }

    const formRef = useRef(null);

    const hadleConfirmDate = () => {
        setOpenDate(true)
    }

    const handleCloseBackdropButtonDate = (submit) => {
        setOpenDate(false);

        if (submit) {
            formRef.current?.requestSubmit();
        }
    };

    return (
        <div className="formUser">
            <h1>Selecionar comanda</h1>
            <form ref={formRef} className="classUser" onSubmit={handleSubmit}>
                <p style={{ height: '45px' }} >
                    ETC$: {carrinho.length === 0 ? " Não há nenhum item no carrinho." : total}
                </p>
                {dados.saldo >= 0 && dados.saldo !== "" &&
                    <p style={{ height: '45px' }} >
                        Saldo: {dados.saldo} ETC$
                    </p>
                }
                <div className='inputoes'>
                    <Autocomplete
                        value={dados.id ? { id: dados.id, nome: dados.nome } : null}
                        options={comandas}
                        getOptionLabel={(option) => {
                            if (!option) return "";
                            return `${option.id} - ${option.nome}`;
                        }}
                        onChange={(event, newValue) => {
                            if (newValue === null) {
                                setDados({
                                    id: "",
                                    nome: "",
                                    saldo: "",
                                    data: ""
                                });
                            } else {
                                const dataFormatada = new Date(newValue.data).toLocaleDateString('pt-BR');

                                setDados({
                                    ...dados,
                                    id: newValue.id,
                                    nome: newValue.nome,
                                    saldo: newValue.saldo,
                                    data: dataFormatada
                                });
                            }
                        }}
                        selectOnFocus
                        clearOnBlur
                        handleHomeEndKeys
                        renderOption={(props, option) => {
                            const { key, ...rest } = props;
                            return (
                                <li key={option.id} {...rest}>
                                    {option.id} - {option.nome}
                                </li>
                            );
                        }}
                        sx={{
                            width: '275px',
                            height: '90px',
                            "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: "#343c4c",
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#343c4c",
                                },
                            },
                            "& .MuiInputLabel-root": {
                                color: "#343c4c",
                            },
                            "& .Mui-focused label": {
                                color: "#343c4c",
                            },
                        }}
                        freeSolo
                        renderInput={(params) => (
                            <TextField
                                name="comanda"
                                onChange={handleChange}
                                {...params}
                                label="Comanda"
                                onClick={readComandas}
                                required
                                sx={{
                                    top: dados.saldo !== "" ? '-10px' : '45px'
                                }}
                                size="small"
                            />
                        )}
                        required
                    />
                </div>
                <Button
                    type="button"
                    onClick={hadleConfirmDate}
                    variant="contained"
                    endIcon={<SendRoundedIcon />}
                    id='buttonEnviar'
                    sx={{
                        top: dados.saldo !== "" ? '' : '55px',
                        marginTop: '-36px',
                        borderRadius: '1rem'
                    }}
                >
                    Enviar
                </Button>
            </form>
            <div onClick={(e) => e.stopPropagation()} >
                <Alerta state={openAlertCart} onClose={handleCloseBackdropButton} text="O carrinho está vazio" severity="warning" />
            </div>
            <div onClick={(e) => e.stopPropagation()}>
                <Alerta state={openAlertAdd} onClose={handleCloseBackdropButton} text="Venda realizada com sucesso!" severity="success" />
            </div>
            <div onClick={(e) => e.stopPropagation()}>
                <Alerta state={openAlertBalance} onClose={handleCloseBackdropButton} text="O valor total do carrinho é inválido" severity="error" />
            </div>
            <div onClick={(e) => e.stopPropagation()}>
                <Alerta state={openAlertSell} onClose={handleCloseBackdropButton} text="Ocorreu um erro ao realizar a venda" severity="error" />
            </div>
            <div onClick={(e) => e.stopPropagation()}>
                <Alerta state={openAlertMoney} onClose={handleCloseBackdropButton} text={`Saldo da comanda insuficiente`} severity="error" />
            </div>
            {openDate && <ConfirmDate openOptions={openDate} handleCloseBackdropButton={handleCloseBackdropButtonDate} data={dados.data} />}
        </div>
    )
}