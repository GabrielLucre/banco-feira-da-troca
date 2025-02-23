/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import axios from 'axios'
import { doc, getDoc } from "firebase/firestore"
import QRcode from 'qrcode'
import { useEffect, useRef, useState } from 'react'
import Tilt from 'react-vanilla-tilt'
import { dbComandas } from '../../lib/firebaseConfig.js'

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
    const [stateLoading, setStateLoading] = useState(false)
    const [comandas, setComandas] = useState([])
    const [valueID, setValueID] = useState()
    const [valueSaldo, setValueSaldo] = useState()
    const [valueNome, setValueNome] = useState()
    const [cardQR, setCardQR] = useState()

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
        setStateLoading(false)
    };

    const handleClose = () => {
        onClose(selectedValue);
    };

    const readComandas = async () => {
        setStateLoading(true)
        try {
            const response = await axios.get('http://localhost:3000/comandas/get')

            setStateLoading(false)
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
                    let imagensQR = await QRcode.toDataURL(comanda.id, {
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
        const regex = /^[a-zA-Z0-9\s.]+$/;
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
                    valueNome: valueNome
                })
                setStateLoading(false);
                setOpen(true);
                await readComandas();
                nextID();
                setDisable(false)
            } else {
                console.error("O cartão já foi cadastrado por outro usuário.")
                setOpenError(true)
                setStateLoading(false)
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
                setStateLoading(false);
                setOpenEdit(true)
            } else {
                console.error("Erro ao editar a comanda.")
                setOpenError(true)
                setStateLoading(false)
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
                    valueNome: valueNome
                })
                location.reload()
                setStateLoading(false);
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
                                        <input type='text' autoComplete="off" placeholder='Nome aqui' ref={inputNome} id={option} onChange={handleChange} onKeyDown={valueNome && handleKeyDownCadastro} />
                                    )
                                }
                            </div>
                            {edit !== null || <div style={{ marginLeft: 'auto', marginRight: '0', marginBottom: '-60px', marginTop: '-30px' }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="115" zoomAndPan="magnify" viewBox="0 0 810 809.999993" height="115" preserveAspectRatio="xMidYMid meet" version="1.0"><defs><clipPath id="db23ce5ef0"><path d="M 0 297.257812 L 810 297.257812 L 810 512.507812 L 0 512.507812 Z M 0 297.257812 " clipRule="nonzero" /></clipPath></defs><g clipPath="url(#db23ce5ef0)"><path fill="var(--primary-color)" d="M 45.734375 379.699219 C 53.582031 385.550781 60.347656 384.535156 67.308594 377.605469 C 70.480469 374.4375 73.390625 371.003906 76.953125 367.113281 C 81.59375 371.136719 85.679688 374.46875 89.535156 378.066406 C 125.066406 410.914062 162.789062 440.660156 205.96875 463.019531 C 262.910156 492.503906 322.53125 509.007812 387.285156 502.339844 C 391.304688 501.914062 395.554688 503.027344 399.640625 503.648438 C 417.386719 506.425781 435.007812 510.644531 452.820312 511.851562 C 500.21875 515.121094 545.882812 505.28125 590.304688 490.050781 C 662.835938 465.175781 729.679688 428.992188 792.503906 385.253906 C 797.179688 381.988281 801.789062 378.390625 805.710938 374.273438 C 810.222656 369.5 809.960938 363.585938 806.101562 359.890625 C 802.34375 356.328125 798.550781 356.6875 792.703125 360.347656 C 767.792969 376.039062 743.214844 392.316406 717.78125 407.089844 C 672.347656 433.46875 625.210938 456.449219 574.972656 472.367188 C 538.691406 483.871094 501.6875 491.390625 463.378906 491.03125 C 458.574219 491 453.800781 490.507812 448.996094 490.214844 C 451.285156 487.109375 453.769531 485.703125 456.382812 484.589844 C 480.964844 474.097656 502.964844 459.554688 521.5625 440.464844 C 531.367188 430.429688 540.816406 419.414062 547.710938 407.320312 C 565.429688 376.300781 554.9375 347.925781 521.824219 334.917969 C 512.636719 331.320312 502.800781 328.835938 493.027344 327.433594 C 456.253906 322.234375 420.429688 326.8125 386.074219 340.734375 C 365.1875 349.203125 347.273438 362.144531 333.644531 380.484375 C 310.894531 411.109375 313.769531 446.21875 341.195312 472.628906 C 343.84375 475.179688 346.523438 477.695312 350.675781 481.648438 C 344.988281 481.550781 341.261719 482.007812 337.695312 481.386719 C 319.621094 478.21875 301.347656 475.832031 283.632812 471.253906 C 251.535156 462.921875 222.050781 448.242188 193.578125 431.441406 C 156.773438 409.738281 125.003906 381.824219 93.65625 352.535156 C 95.386719 350.671875 96.464844 349.070312 97.9375 347.925781 C 114.3125 335.441406 107.382812 327.726562 93.558594 318.507812 C 92.316406 317.691406 90.714844 317.398438 89.242188 316.941406 C 70.546875 311.316406 51.882812 305.566406 33.117188 300.171875 C 28.019531 298.699219 22.625 297.554688 17.363281 297.457031 C 7.296875 297.261719 0.691406 303.863281 0.921875 313.933594 C 1.019531 318.378906 1.902344 323.378906 4.191406 327.039062 C 12.003906 339.65625 20.175781 352.144531 29.097656 364.007812 C 33.640625 370.054688 39.65625 375.15625 45.734375 379.699219 Z M 348.941406 448.703125 C 337.535156 433.078125 336.914062 416.929688 346.261719 400.390625 C 354.367188 386.039062 366.363281 375.1875 380.714844 367.570312 C 418.597656 347.46875 458.902344 342.46875 500.839844 350.640625 C 507.472656 351.949219 514.140625 354.496094 520.125 357.699219 C 533.851562 364.988281 538.101562 376.167969 531.988281 390.386719 C 528.558594 398.332031 523.785156 406.011719 518.226562 412.679688 C 499.335938 435.332031 475.832031 452.132812 441.609375 467.59375 C 433.46875 469.785156 417.683594 474.230469 401.796875 478.21875 C 398.625 479.035156 394.703125 479.230469 391.730469 478.085938 C 375.125 471.84375 359.792969 463.574219 348.941406 448.703125 Z M 77.117188 337.140625 C 69.074219 344.398438 61.785156 350.933594 54.398438 357.570312 C 45.3125 351.949219 37.761719 342.761719 25.863281 322.628906 C 33.183594 321.941406 60.675781 329.589844 77.117188 337.140625 Z M 77.117188 337.140625 " fillOpacity="1" fillRule="nonzero" /></g></svg>
                            </div>}
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
                    {/* <Loading state={stateLoading} onClose={handleCloseConfirm} /> */}
                </div>
            </div >
        </Backdrop >
    )
}