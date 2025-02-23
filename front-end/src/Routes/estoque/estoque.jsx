import axios from "axios"
import { useEffect, useState } from "react"

import FilterProduct from "../../components/FilterProduct/FilterProduct.jsx"

const Estoque = () => {
    // * Pegando os produtos e caixas
    const [produtos, setProdutos] = useState([])
    const [box, setBox] = useState([])

    const fetchProdutos = async () => {
        try {
            const response = await axios.get("http://localhost:3000/stock/get");
            const produtosDaApi = response.data;

            const produtosSessao = JSON.parse(sessionStorage.getItem('saveProducts')) || [];

            const produtosFiltrados = produtosDaApi.filter(
                (produto) => !produtosSessao.some((saved) => saved.id === produto.id)
            );

            setProdutos(produtosFiltrados);
        } catch (err) {
            console.error("Erro: ", err);
        }
    };


    const fetchBox = async () => {
        try {
            const response = await axios.get("http://localhost:3000/stock/box/get")
            setBox(response.data)
        } catch (e) {
            console.log(e)
        }
    }

    useEffect(() => {
        fetchProdutos()
        fetchBox()
    }, [])

    return (
        <FilterProduct produtos={produtos} setProdutos={setProdutos} box={box} />
    )
}

export default Estoque
