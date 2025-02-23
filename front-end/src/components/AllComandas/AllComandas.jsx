/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import axios from 'axios'

import FormComandas from '../FormComandas/FormComandas'
import Alerta from '../Alerta/Alerta'

import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";

import './AllComandas.css'

export default function AllComandasComponent() {
    const [openComandas, setOpenComandas] = useState(false)
    const [comandas, setComandas] = useState([])
    const [stateLoading, setStateLoading] = useState(false)
    const [idSearch, setIdSearch] = useState("")
    const [comandaName, setComandaName] = useState("")
    const [comandaSelected, setComandaSelected] = useState()
    const [nameSearch, setNameSearch] = useState("")
    const [selectedValue, setSelectedValue] = useState();
    const [openError, setOpenError] = useState(false)
    const [openErrorComad, setOpenErrorComad] = useState(false)
    const [open, setOpen] = useState(false);

    const readComandas = async () => {
        setStateLoading(true);

        let timeout;

        try {
            timeout = setTimeout(() => {
                setStateLoading(false);
                console.error("Tempo de resposta excedido. Tente novamente.");
                setOpenErrorComad(true)
            }, 5000);

            const response = await axios.get('http://localhost:3000/comandas/get');

            clearTimeout(timeout);

            setComandas(response.data);
            setStateLoading(false);

        } catch (err) {
            console.error(err);
            clearTimeout(timeout);
            setStateLoading(false);
        }
    };

    useEffect(() => {
        readComandas();
    }, []);

    useEffect(() => {
        readComandas();
    }, []);

    const handleCloseLoading = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }

        setStateLoading(false)
    };

    const handleChange = (e) => {
        setIdSearch(e.target.value)
        setNameSearch(e.target.value.toUpperCase())
    }

    const handleClickOpen = (id, name) => {
        setComandaSelected(id)
        setComandaName(name)
        setOpen(true);
    };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }

        setOpenErrorComad(false)
        setOpen(false)
        setOpenError(false)
    };

    const filteredComandas = () => {
        let searchStr = nameSearch;
        let results = [];

        while (searchStr.length > 0) {
            results = comandas.filter((comanda) =>
                comanda.id.includes(idSearch) || comanda.nome.toUpperCase().includes(searchStr.toUpperCase())
            );

            if (results.length > 0) break;

            searchStr = searchStr.slice(0, -1);
        }

        return results.map((comanda) => (
            <div
                className={comanda.ativo ? 'boxComanda' : 'boxComandaDesativa'}
                key={comanda.id}
                onClick={() => {
                    if (comanda.ativo) {
                        handleClickOpen(comanda.id, comanda.nome);
                    } else {
                        setOpenError(true);
                    }
                }}
            >
                <p>{comanda.id} - {comanda.nome}</p>
            </div>
        ));
    };

    const handleClickFormComandas = () => {
        setOpenComandas(true);
    }

    const handleCloseComandas = () => {
        setOpenComandas(false)
    }

    return (
        <div className="button-container">
            <div className='form-search'>
                <form>
                    <TextField
                        name="comanda"
                        label="Comanda"
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon />
                                    </InputAdornment>
                                ),
                            },
                        }}
                        onChange={handleChange}
                    />
                </form>
            </div>
            <div className='comandas'>
                {nameSearch || idSearch ? filteredComandas() :
                    comandas.map((comanda) => (
                        <div
                            className={comanda.ativo ? 'boxComanda' : 'boxComandaDesativa'}
                            key={comanda.id}
                            onClick={() => {
                                if (comanda.ativo) {
                                    handleClickOpen(comanda.id, comanda.nome);
                                } else {
                                    setOpenError(true);
                                }
                            }}
                        >
                            <p>{comanda.id} - {comanda.nome}</p>
                        </div>
                    ))}
                {open && <FormComandas backdropOpen={open} onClose={handleClose} selectedValue={selectedValue} edit={comandaSelected} name={comandaName} />}
            </div>
            <div className='loading-comandas'>
                {stateLoading && <CircularProgress sx={{ color: 'var(--third-color)' }} />}
            </div>
            <div>
                <Alerta state={openError} onClose={handleClose} text="Não é possivel selecionar a comanda!" severity="error" />
            </div>
            <div>
                <Alerta state={openErrorComad} onClose={handleClose} text="Erro ao carregar as comandas!" severity="error" />
            </div>
            <FormComandas
                edit={null}
                onClick={handleClickFormComandas}
                backdropOpen={openComandas}
                onClose={handleCloseComandas}
            />
        </div>
    )
}