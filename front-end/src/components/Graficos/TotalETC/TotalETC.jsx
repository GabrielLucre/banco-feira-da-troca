import { useState, useEffect } from 'react'
import axios from 'axios'
import './TotalETC.css'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'

export default function TotalETC(filtro) {
    const [totalETC, setTotalETC] = useState(0)
    const [increasePercentage, setIncreasePercentage] = useState(0)

    const fetchTotalETC = async () => {
        try {
            const response = await axios.get("http://localhost:3000/metrics/getComandasAtivas", { params: { filter: `${filtro.filtro}` } })

            const comandasDatas = response.data.data

            setTotalETC(comandasDatas)
            setIncreasePercentage(response.data.increasePercentage)
        } catch (err) {
            console.error(err)
        }
    }

    useEffect(() => {
        fetchTotalETC()
    }, [])

    useEffect(() => {
        fetchTotalETC()
    }, [filtro])

    return (
        <div className='graficoBox' id='totalETC'>
            <div className='iconetitle'>
                <div className='left'>
                    <AttachMoneyIcon
                        sx={{
                            borderRadius: '50%',
                            padding: '4px',
                        }}
                        style={{
                            backgroundColor: 'var(--sixth-color)',
                            color: 'var(--third-color)'
                        }}
                    />
                    <p id="title">Total de ETC</p>
                </div>
                <div className='right'>
                    {
                        increasePercentage > 0 ? (
                            <>
                                <TrendingUpIcon color="success" />
                                <p id='trendinggraphic'>{increasePercentage}%</p>
                            </>
                        ) : (
                            <>
                                <TrendingDownIcon color="error" />
                                <p style={{ color: "#d32f2f" }}>{increasePercentage}%</p>
                            </>
                        )
                    }
                </div>
            </div>
            <b>$ {totalETC}</b>
        </div>
    )
}