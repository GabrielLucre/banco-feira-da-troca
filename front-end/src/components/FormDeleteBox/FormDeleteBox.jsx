/* eslint-disable react/prop-types */
import Backdrop from "@mui/material/Backdrop";
import Button from "@mui/material/Button";

import "./FormDeleteBox.css";

const FormDeleteBox = ({ openConfirm, handleCloseBackdropButton, deleteBox, caixaID }) => {
    return (
        <Backdrop
            sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.drawer + 10000 })}
            open={openConfirm}
            onClick={handleCloseBackdropButton}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: `var(--primary-color)`,
                    color: `black`,
                    width: `20dvw`,
                    borderRadius: `10px`,
                    paddingLeft: `1.5rem`,
                    paddingTop: `1px`,
                    display: 'flex',
                    flexDirection: 'column'
                }}
            >
                <h1>Tem certeza disso?</h1>
                <p>Não poderá voltar atrás depois</p>
                <div className="form-buttons">
                    <Button
                        onClick={(e) => deleteBox(e, caixaID)}
                        sx={{
                            color: 'black',
                            borderRadius: '0.5rem'
                        }}
                    >
                        SIM
                    </Button>
                    <Button
                        onClick={handleCloseBackdropButton}
                        sx={{
                            color: 'black',
                            borderRadius: '0.5rem'
                        }}
                    >
                        NÃO
                    </Button>
                </div>
            </div>
        </Backdrop>
    )
}

export default FormDeleteBox
