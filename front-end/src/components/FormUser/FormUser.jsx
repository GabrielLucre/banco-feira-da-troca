/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import axios from 'axios'
import { doc, increment, updateDoc } from "firebase/firestore"
import { useState } from "react"
import { dbComandas } from '../../lib/firebaseConfig'
import './FormUser.css'

import AddCardIcon from '@mui/icons-material/AddCard'
import SendRoundedIcon from '@mui/icons-material/SendRounded'
import Autocomplete from "@mui/material/Autocomplete"
import Button from '@mui/material/Button'
import IconButton from "@mui/material/IconButton"
import TextField from "@mui/material/TextField"

import Alerta from '../Alerta/Alerta'
import FormComandas from '../FormComandas/FormComandas'

import "../FormProduct/FormProduct.css"

export default function FormUser({ subCategorias, total, setTotal, carrinho, setCarrinho }) {
    const [stateReadComanda, setStateReadComanda] = useState(false)
    const [stateLoading, setStateLoading] = useState(false)
    const [openAlertCart, setOpenAlertCart] = useState(false)
    const [openAlertAdd, setOpenAlertAdd] = useState(false)
    const [openAlertBalance, setOpenAlertBalance] = useState(false)
    const [openAlertBuy, setOpenAlertBuy] = useState(false)
    const [comandas, setComandas] = useState([])

    const handleSubmit = async (event) => {
        event.preventDefault()

        try {
            const carrinho = JSON.parse(localStorage.getItem("carrinho"));
            if (!carrinho || carrinho.length === 0) {
                setOpenAlertCart(true)
                return
            }

            let produtos = [];

            carrinho.forEach(item => {
                for (let i = 0; i < item.quantidade; i++) {
                    produtos.push({
                        nome: item.nomeProduto,
                        subcategoriaID: subCategorias.find(subcategoria => subcategoria.nome.toUpperCase() === item.subcategoriaProduto.toUpperCase()).id,
                        valor: item.valorProduto
                    });
                }
            });

            const response = await axios.post("http://localhost:3000/stock/receive", {
                produtos: produtos,
                comandaId: dados.id,
                tipo: "Entrada"
            })

            if (!response.status === 200) {
                console.error("Erro ao cadastrar produtos no MySQL.")
                return
            }

            if (total <= 0) {
                setOpenAlertBalance(true)
                return
            }

            const comandaRef = doc(dbComandas, "comandas", dados.id)

            await updateDoc(comandaRef, {
                saldo: increment(total),
            });

            setOpenAlertAdd(true)
            localStorage.removeItem("carrinho")
        } catch (error) {
            console.error("Erro ao processar a compra:", error)
            setOpenAlertBuy(true)
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
        nome: ""
    })

    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    }

    const handleClose = (valor) => {
        setOpen(false)
    }

    const handleCloseBackdropButton = () => {
        if (openAlertAdd) {
            setOpenAlertAdd(false)
            setCarrinho([])
        }

        setOpenAlertBalance(false)
        setOpenAlertCart(false)
        setOpenAlertBuy(false)
    }

    return (
        <div className="formUser">
            <h1>Selecionar comanda</h1>
            <form className="classUser" onSubmit={handleSubmit}>
                <p style={{ height: '45px' }} >
                    ETC$: {carrinho.length === 0 ? " Não há nenhum item no carrinho." : total}
                </p>
                <div className='inputoes'>
                    <Autocomplete
                        value={dados.id ? { id: dados.id, nome: dados.nome } : null}
                        id="free-solo-dialog-demo"
                        options={comandas}
                        getOptionLabel={(option) => {
                            if (!option) return "";
                            return `${option.id} - ${option.nome}`;
                        }}
                        onChange={(event, newValue) => {
                            if (newValue === null) {
                                setDados({
                                    ...dados,
                                    id: undefined,
                                    nome: "",
                                })
                            } else {
                                setDados({
                                    ...dados,
                                    id: newValue.id,
                                    nome: newValue.nome,
                                })
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
                                    top: '45px'
                                }}
                                size="small"
                            />
                        )}
                        required
                    />
                    <IconButton
                        size='large'
                        onClick={handleClickOpen}
                        sx={{
                            marginTop: '39px'
                        }}
                    >
                        <AddCardIcon fontSize='inherit' />
                    </IconButton>
                </div>
                <Button
                    type="submit"
                    variant="contained"
                    endIcon={<SendRoundedIcon />}
                    id='buttonEnviar'
                    sx={{
                        top: '18px',
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
                <Alerta state={openAlertAdd} onClose={handleCloseBackdropButton} text="Compra realizada com sucesso!" severity="success" />
            </div>
            <div onClick={(e) => e.stopPropagation()}>
                <Alerta state={openAlertBalance} onClose={handleCloseBackdropButton} text="O valor total do carrinho é inválido" severity="error" />
            </div>
            <div onClick={(e) => e.stopPropagation()}>
                <Alerta state={openAlertBuy} onClose={handleCloseBackdropButton} text="Ocorreu um erro ao realizar a compra" severity="error" />
            </div>
            <FormComandas
                edit={null}
                onClick={handleClickOpen}
                backdropOpen={open}
                onClose={handleClose}
            />
        </div>
    )
}