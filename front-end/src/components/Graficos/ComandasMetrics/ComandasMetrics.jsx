import CreditCardIcon from '@mui/icons-material/CreditCard'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import axios from 'axios'
import { useEffect, useState } from 'react'
import './ComandasMetrics.css'

export default function ComandasMetrics(filtro) {
    const [quantidadeComandaAtiva, setQuantidadeComandaAtiva] = useState(0)


    const fetchQuantidadeComandas = async () => {
        try {
            const response = await axios.get("http://localhost:3000/metrics/getComandas", { params: { filter: `${filtro.filtro}` } })
            setQuantidadeComandaAtiva(response.data.currentPeriodCount.ativado)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        fetchQuantidadeComandas()
    }, [])

    useEffect(() => {
        fetchQuantidadeComandas()
    }, [filtro])

    return (
        <div className='graficoBox' id='comandasBox'>
            <div className='iconetitle'>
                <div className='left'>
                    <CreditCardIcon
                        sx={{
                            borderRadius: '50%',
                            padding: '4px',
                        }}
                        style={{
                            backgroundColor: 'var(--sixth-color)',
                            color: 'var(--third-color)'
                        }}
                    />
                    <p id="title">Comandas</p>
                </div>
                <div className='right'>
                    <TrendingUpIcon color="success" />
                    <p id='trendinggraphic'>+2%</p>
                </div>
            </div>
            <div className='comandascadastradas'>
                <p id='metric'>{quantidadeComandaAtiva}/550</p>
                <p id='subtitlemetric'>comandas cadastradas</p>
            </div>
        </div>
    )
}