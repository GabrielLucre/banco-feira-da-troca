/* eslint-disable react/prop-types */
import { useState } from "react";
import Button from "@mui/material/Button";
import Backdrop from "@mui/material/Backdrop";

import Alerta from '../Alerta/Alerta.jsx'

import "./ConfirmDate.css"

const ConfirmDate = ({ openOptions, handleCloseBackdropButton, data }) => {
    const [openAlertSell, setOpenAlertSell] = useState(false)
    const [date, setDate] = useState("")

    const handleDateChange = (event) => {
        setDate(event.target.value);
    };

    const handleConfirmDate = () => {
        const dataFormatada = new Date(date).toLocaleDateString('pt-BR');

        if (dataFormatada === data) {
            handleCloseBackdropButton(true)
        } else {
            setOpenAlertSell(true)
        }
    };

    const handleCloseAlertDate = () => {
        setOpenAlertSell(false)
    }

    return (
        <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 10000 })}
            open={openOptions}
            onClick={() => handleCloseBackdropButton(false)}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: `var(--primary-color)`,
                    color: `black`,
                    width: `20dvw`,
                    borderRadius: `10px`,
                    paddingLeft: `30px`,
                    paddingTop: `22px`,
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <h2>Selecionar data</h2>
                <input
                    type="date"
                    name="date"
                    id="date"
                    value={date}
                    onChange={handleDateChange}
                    style={{
                        border: 0,
                        outline: "none",
                        marginLeft: "-30px",
                        backgroundColor: "var(--primary-color)",
                        marginTop: "1rem",
                        textAlign: "center",
                        fontSize: "35px"
                    }}
                />
                <div className="form-buttons">
                    <Button
                        type="button"
                        onClick={handleConfirmDate}
                        sx={{
                            color: 'black',
                            textTransform: 'none',
                            fontWeight: "600",
                            borderRadius: '0.5rem',
                            marginLeft: "auto",
                            fontSize: "17px"
                        }}
                    >
                        Confirmar
                    </Button>
                </div>
            </div>
            <div onClick={(e) => e.stopPropagation()}>
                <Alerta state={openAlertSell} onClose={handleCloseAlertDate} text="Data inválida" severity="error" />
            </div>
        </Backdrop>
    )
}

export default ConfirmDate
