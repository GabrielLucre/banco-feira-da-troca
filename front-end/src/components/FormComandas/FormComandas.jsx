/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import axios from 'axios'
import { doc, getDoc } from "firebase/firestore"
import QRcode from 'qrcode'
import { useEffect, useRef, useState } from 'react'
import Tilt from 'react-vanilla-tilt'
import { dbComandas } from '../../lib/firebaseConfig.js'

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import CreditScoreIcon from '@mui/icons-material/CreditScore'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import EditIcon from '@mui/icons-material/Edit'
import SendRoundedIcon from '@mui/icons-material/SendRounded'

import Backdrop from '@mui/material/Backdrop'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'

import './FormComandas.css'

import { getUserData } from '../../../../back-end/utils/authUtils.js'
import Alerta from '../Alerta/Alerta'

export default function FormComandas({ backdropOpen, onClose, selectedValue, edit, name }) {
    const inputNome = useRef()
    const [option, setOption] = useState()
    const [open, setOpen] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)
    const [openError, setOpenError] = useState(false)
    const [comandas, setComandas] = useState([])
    const [valueID, setValueID] = useState()
    const [valueSaldo, setValueSaldo] = useState()
    const [valueNome, setValueNome] = useState()
    const [cardQR, setCardQR] = useState()
    const [date, setDate] = useState("")

    useEffect(() => {
        const handlePaste = (event) => {
            event.preventDefault();
        };

        window.addEventListener("paste", handlePaste);

        return () => {
            window.removeEventListener("paste", handlePaste);
        };
    }, []);

    const handleCloseConfirm = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }

        if (open === true) {
            setOpen(false)
            window.location.href = "/"
        }

        if (openEdit === true) {
            setOpenEdit(false);
            window.location.href = "/comandas"
        }

        setOpenError(false)
    };

    const handleClose = () => {
        onClose(selectedValue);
    };

    const readComandas = async () => {
        try {
            const response = await axios.get('http://localhost:3000/comandas/get')

            setComandas(response.data)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        readComandas()
    }, [])

    const rootStyles = getComputedStyle(document.documentElement);
    const cardColor1 = rootStyles.getPropertyValue('--card-color1').trim();
    const primaryColor = rootStyles.getPropertyValue('--primary-color').trim();

    const nextID = async () => {
        for (let i = 0; i < comandas.length; i++) {
            let comanda = comandas[i]
            if (!comanda.ativo) {
                try {
                    let imagensQR = await QRcode.toDataURL("https://criptoetec.web.app/", {
                        width: 300,
                        margin: 4,
                        color: {
                            dark: cardColor1,
                            light: primaryColor,
                        },
                        errorCorrectionLevel: 'H',
                    })
                    setValueID(comanda.id)
                    setValueSaldo(comanda.saldo)
                    inputNome.current.value = ""
                    setDate("")
                    setCardQR(imagensQR)
                    break
                } catch (err) {
                    console.error("Erro ao gerar QR Code.")
                }
            }
        }
    }

    const selectedID = async () => {
        try {
            const referencia = doc(dbComandas, "comandas", edit)
            const docSnap = await getDoc(referencia)

            let imagensQR = await QRcode.toDataURL(docSnap.id, {
                width: 300,
                margin: 4,
                color: {
                    dark: cardColor1,
                    light: primaryColor,
                },
                errorCorrectionLevel: 'H',
            })

            setCardQR(imagensQR)
            setValueID(docSnap.id)
            setValueSaldo(docSnap.data().saldo)
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (edit !== null) {
            selectedID()
            setOption("inputLegal")
        } else {
            nextID()
            setOption("inputNext")
        }
    }, [comandas])

    const handleChange = (e) => {
        const { value } = e.target

        setValueNome(value)
    }

    const isSafeInput = (input) => {
        const regex = /^[a-zA-Z0-9\s.\u00C0-\u00FF]+$/;
        return regex.test(input);
    };

    const userData = getUserData();
    const isMaster = userData?.username === "Admin";

    const [disable, setDisable] = useState(false)

    const handleSubmit = async () => {
        setDisable(true)

        if (!isSafeInput(valueNome)) {
            return;
        }

        try {
            const referencia = doc(dbComandas, "comandas", valueID)
            const docSnap = await getDoc(referencia)

            if (docSnap.exists() && !docSnap.data().ativo) {
                const response = await axios.post("http://localhost:3000/comandas/post", {
                    valueID: valueID,
                    valueNome: valueNome,
                    valueDate: date
                })
                setOpen(true);
                await readComandas();
                nextID();
                setDisable(false)
            } else {
                console.error("O cartão já foi cadastrado por outro usuário.")
                setOpenError(true)
                setDisable(false)
            }
        } catch (erro) {
            console.error("Erro ao atualizar:", erro)
            setOpenError(true)
        }
    }

    const handleEdit = async () => {
        try {
            const referencia = doc(dbComandas, "comandas", edit)
            const docSnap = await getDoc(referencia)

            if (docSnap.exists() && docSnap.data().ativo) {
                const response = await axios.post("http://localhost:3000/comandas/edit", {
                    valueIDedit: edit,
                    valueNome: valueNome
                })
                setOpenEdit(true)
            } else {
                console.error("Erro ao editar a comanda.")
                setOpenError(true)
            }
        } catch (erro) {
            console.error("Erro ao editar: ", erro)
            setOpenError(true)
        }
    }

    const handleKeyDown = async (e) => {
        if (e.key === "Enter") {
            handleEdit()
        }
    }

    const handleKeyDownCadastro = async (e) => {
        if (e.key === "Enter") {
            await handleSubmit()
        }
    }

    const handleDisable = async () => {
        try {
            const referencia = doc(dbComandas, "comandas", edit)
            const docSnap = await getDoc(referencia)

            if (docSnap.exists() && docSnap.data().ativo) {
                const response = await axios.post("http://localhost:3000/comandas/disable", {
                    valueIDedit: edit,
                    valueNome: valueNome,
                })
                location.reload()
            } else {
                console.error("O cartão já está desativado.")
            }
        } catch (erro) {
            console.error("Erro ao atualizar:", erro)
            setOpenError(true)
        }
    }

    function handleSelectText() {
        inputNome.current.select()
    }

    return (
        <Backdrop
            sx={(theme) => ({
                color: '#fff',
                zIndex: theme.zIndex.drawer + 9999,
            })}
            onClick={handleClose}
            open={backdropOpen}
        >
            <div onClick={(e) => e.stopPropagation()}>
                <div className='content-comanda'>
                    <Tilt className="card-comanda" options={{
                        max: 90,
                        scale: 2,
                        perspective: 50000,
                    }} style={{ padding: 0 }}>
                        <div className='qrID'>
                            <p>{valueID}</p>
                            <img src={cardQR} draggable="false"></img>
                            <p id='escaneie'>Escaneie com uma câmera</p>
                        </div>
                        <div className='otherInfos'>
                            <p>{valueSaldo} ETC</p>
                            <div className='inputName'>
                                {
                                    edit !== null ? (
                                        <>
                                            {isMaster ? <input type='text' autoComplete="off" defaultValue={name} ref={inputNome} id={option} onChange={handleChange} onKeyDown={valueNome && handleKeyDown} /> : <span>{name}</span>}
                                            {isMaster &&
                                                <IconButton sx={{ color: 'white' }} onClick={valueNome && handleEdit}>
                                                    {valueNome ? <CreditScoreIcon /> : <EditIcon onClick={handleSelectText} />}
                                                </IconButton>}
                                        </>
                                    ) : (
                                        <div>
                                            <input
                                                type='text'
                                                autoComplete="off"
                                                placeholder='Nome'
                                                ref={inputNome}
                                                id={option}
                                                onChange={handleChange}
                                                onKeyDown={valueNome && handleKeyDownCadastro}
                                                style={{ fontSize: "20px" }}
                                            />
                                            <div className="relative">
                                                <input
                                                    type="date"
                                                    name="date"
                                                    id="date"
                                                    style={{ fontSize: "19px", marginTop: "5px" }}
                                                    value={date}
                                                    onChange={(e) => setDate(e.target.value)}
                                                    onKeyDown={date && handleKeyDownCadastro}
                                                    required
                                                />
                                                <spam>
                                                    <CalendarMonthIcon />
                                                </spam>
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </Tilt>
                    {
                        edit !== null && isMaster ? (
                            <div className="form-buttons">
                                <Button startIcon={<DeleteForeverIcon />} id='botoesDesativar' onClick={handleDisable} sx={{ width: `100%` }}>Desativar</Button>
                            </div>
                        ) : (
                            edit === null && (
                                <div className="9-buttons">
                                    <Button startIcon={<SendRoundedIcon />} id='botoes' disabled={open || disable} onClick={handleSubmit} sx={{ width: `100%` }}>
                                        Cadastrar
                                    </Button>
                                </div>
                            )
                        )
                    }
                    <div onClick={(e) => e.stopPropagation()} >
                        <Alerta state={open} onClose={handleCloseConfirm} text="Usuário cadastrado com sucesso!" severity="success" />
                    </div>
                    <div onClick={(e) => e.stopPropagation()}>
                        <Alerta state={openError} onClose={handleCloseConfirm} text="Não foi possível cadastrar o Usuário!" severity="error" />
                    </div>
                    <div>
                        <Alerta state={openEdit} onClose={handleCloseConfirm} text="Comanda editada com sucesso!" severity="info" />
                    </div>
                </div>
            </div >
        </Backdrop >
    )
}