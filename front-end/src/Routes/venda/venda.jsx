import axios from 'axios'
import { useEffect, useState } from 'react'

import { FormSealing } from '../../components/FormSealing/FormSealing'
import ShortcutsProdutos from '../../components/ShortcutsProdutos/ShortcutsProdutos'
import Transacoes from '../../components/Transacoes/Transacoes'

import '../produtos/produtos.css'

const Venda = () => {
    // * Pegando os produtos
    const [produtos, setProdutos] = useState([])

    const fetchProdutos = async () => {
        try {
            const responde = await axios.get("http://localhost:3000/stock/get")
            setProdutos(responde.data)
        } catch (err) {
            console.error("Erro: ", err)
        }
    }

    useEffect(() => {
        fetchProdutos()
    }, [])

    return (
        <div className='conteudoTotal'>
            <FormSealing produtos={produtos} />
            <div className='right-container-produtos'>
                <Transacoes />
                <ShortcutsProdutos />
            </div>
        </div>
    )
}

export default Venda