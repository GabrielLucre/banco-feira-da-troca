/* eslint-disable react/prop-types */
import axios from 'axios';
import { useEffect, useState } from 'react';

import AdicionarCategoria from '../AdicionarCategoria/AdicionarCategoria.jsx';
import FormUserSealing from '../FormUserSealing/FormUserSealing.jsx';

import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import SellIcon from '@mui/icons-material/Sell';

import Alerta from '../Alerta/Alerta';
import { getUserData } from "../../../../back-end/utils/authUtils.js";

import "./FormSealing.css";

const FormSealing = ({ produtos }) => {
    // * Pegando as categorias, subcategorias e caixas
    const [categorias, setCategorias] = useState([])
    const [subCategorias, setSubCategorias] = useState([])
    const [caixas, setCaixas] = useState([])

    const fetchCategorias = async () => {
        try {
            const responde = await axios.get("http://localhost:3000/categories/get");
            setCategorias(responde.data);
        } catch (err) {
            console.log("Erro: ", err)
        }
    }

    const fetchSubCategorias = async () => {
        try {
            const responde = await axios.get(`http://localhost:3000/categories/get/sub`);
            setSubCategorias(responde.data)
        } catch (err) {
            console.log("Erro: ", err)
        }
    }

    const fetchCaixas = async () => {
        try {
            const responde = await axios.get(`http://localhost:3000/stock/box/get`);
            setCaixas(responde.data)
        } catch (err) {
            console.log("Erro: ", err)
        }
    }

    useEffect(() => {
        fetchCategorias()
        fetchSubCategorias()
        fetchCaixas()
    }, [])

    // * Dados do Formulário
    const [dadosFormProduct, setDadosFormProduct] = useState({
        nomeProduto: "",
        valorProduto: "",
        quantidade: "",
        categoriaProduto: "",
        subcategoriaProduto: "",
    })

    const [openAlertAmount, setOpenAlertAmount] = useState(false)
    const [openAlertAmountProduct, setOpenAlertAmountProduct] = useState(false)

    // * Pegar a lista de IDs dos produtos
    const [produtoID, setProdutoID] = useState([])

    const userData = getUserData();
    const tokenData = userData?.username;
    const matchingCaixas = caixas.filter(caixa => caixa.turmaID === tokenData);

    const produtosCaixa = [];

    matchingCaixas.forEach(matchingCaixa => {
        const produtosFiltrados = produtos.filter(produto => produto.caixaID === matchingCaixa.id && produto.vendaStatus === 0);
        produtosCaixa.push(...produtosFiltrados);
    });

    const produtosUnicos = produtosCaixa.filter((value, index, self) =>
        self.findIndex(item => item.nome === value.nome) === index
    );

    const handleChange = (e) => {
        const { name, value } = e.target

        if (name === "quantidade") {
            const produtosDoMesmoNome = produtosCaixa.filter(
                (prod) => prod.nome === dadosFormProduct.nomeProduto
            );

            const quantidadeDisponivel = produtosDoMesmoNome.length;

            if (quantidadeDisponivel === 0) {
                setOpenAlertAmount(true)
                return;
            } else if (value > quantidadeDisponivel) {
                setOpenAlertAmountProduct(true)
                return;
            }

            setDadosFormProduct((prev) => ({
                ...prev,
                [name]: value,
            }));

            const carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];
            const idsExistentes = carrinho.flatMap(item => item.produtoID);

            let novosIDsSelecionados = [];
            let count = 0;

            for (let i = 0; i < quantidadeDisponivel && count < value; i++) {
                const produtoID = produtosDoMesmoNome[i].id;

                if (!idsExistentes.includes(produtoID)) {
                    novosIDsSelecionados.push(produtoID);
                    count++;
                }
            }

            setProdutoID(novosIDsSelecionados);

            return;
        }

        const valorProduto = produtos.find(
            (prod) => prod.nome === value
        )

        const subcategoriaProduto = subCategorias.find(
            (sub) => sub.id === valorProduto.subcategoriaID
        )

        const categoriaProduto = subcategoriaProduto && categorias.find(
            (cat) => cat.id === subcategoriaProduto.categoriaID
        )

        setDadosFormProduct((prev) => ({
            ...prev,
            [name]: value,
            valorProduto: valorProduto.valor,
            categoriaProduto: categoriaProduto.nome,
            subcategoriaProduto: subcategoriaProduto.nome,
        }))
    }

    const handleCloseBackdropButton = () => {
        setTimeout(() => {
            setOpenAlertAmount(false);
            setOpenAlertAmountProduct(false);
        }, 1000);
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        adicionarAoCarrinho(dadosFormProduct)
    };

    // * Botão de adicionar categoria
    const [open, setOpen] = useState(false)

    const handleCloseBackdrop = () => {
        setOpen(false)
    }

    // * Carrinho
    const adicionarAoCarrinho = (produto) => {
        const subcategoriaProduto = subCategorias.find(sub => sub.nome === produto.subcategoriaProduto);

        const quantidadeProduto = parseInt(produto.quantidade, 10);
        const produtoExistente = carrinho.find(item => item.nomeProduto === produto.nomeProduto && item.subcategoriaID === subcategoriaProduto.id);

        const estoqueTotal = produtosCaixa.reduce((total, item) => total + item.estoqueStatus, 0);

        if (produtoExistente) {
            const novaQuantidade = parseInt(produtoExistente.quantidade, 10) + quantidadeProduto;

            if (novaQuantidade > estoqueTotal) {
                setOpenAlertAmountProduct(true);
                return;
            }

            const carrinhoAtualizado = carrinho.map(item =>
                item.nomeProduto === produto.nomeProduto && item.subcategoriaID === subcategoriaProduto.id
                    ? { ...item, quantidade: novaQuantidade.toString(), produtoID: [...item.produtoID, ...produtoID] }
                    : item
            );

            setCarrinho(carrinhoAtualizado);
            localStorage.setItem("carrinho", JSON.stringify(carrinhoAtualizado));
        } else {
            const novoCarrinho = [
                ...carrinho,
                {
                    ...produto,
                    quantidade: quantidadeProduto.toString(),
                    subcategoriaID: subcategoriaProduto.id,
                    produtoID
                }
            ];

            setCarrinho(novoCarrinho);
            localStorage.setItem("carrinho", JSON.stringify(novoCarrinho));
        }

        setDadosFormProduct({
            nomeProduto: "",
            valorProduto: "",
            quantidade: "",
            categoriaProduto: "",
            subcategoriaProduto: "",
        });
    };

    const [carrinho, setCarrinho] = useState([]);

    // * Form User
    const [total, setTotal] = useState(0)

    // * CARREGA SE HOUVER ALGO NO LOCAL STORAGE
    useEffect(() => {
        const carrinhoSalvo = JSON.parse(localStorage.getItem("carrinho")) || [];

        setCarrinho(carrinhoSalvo);
    }, []);

    useEffect(() => {
        const totalCalculado = carrinho.reduce(
            (acc, carro) => acc - Number(carro.valorProduto * carro.quantidade), 0
        )

        setTotal(totalCalculado);
    }, [carrinho]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Tab") {
                e.preventDefault();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <div className='box-form-comanda-carrinho'>
            <div className='content-product'>
                <div className='form-product'>
                    <h1>Selecionar produto</h1>
                    <form onSubmit={handleSubmit}>
                        <div className='box-form-product'>
                            <div className='left-container'>
                                <div className='nome-produto'>
                                    <p>Nome do Produto:</p>
                                    <Autocomplete
                                        options={produtosUnicos}
                                        getOptionLabel={(prod) => prod.nome || ""}
                                        value={produtos.find(prod => prod.nome === dadosFormProduct.nomeProduto) || null}
                                        onChange={(event, newValue) => {
                                            newValue && handleChange({ target: { name: 'nomeProduto', value: newValue.nome } });
                                        }}
                                        size="medium"
                                        sx={{
                                            '& .MuiInputBase-input': {
                                                fontSize: '14px',
                                                lineHeight: '1.2',
                                                padding: '4px 8px',
                                            },
                                            '& .MuiInput-underline:before': {
                                                borderBottom: 'none',
                                            },
                                            '& .MuiInput-underline:after': {
                                                borderBottom: 'none',
                                            },
                                            '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                                                borderBottom: 'none',
                                            },
                                            "& .MuiOutlinedInput-root": {
                                                "& fieldset": {
                                                    borderColor: "#28292b",
                                                },
                                                "&.Mui-focused fieldset": {
                                                    borderColor: "#28292b",
                                                },
                                            },
                                            "& .MuiInputLabel-root": {
                                                color: "#28292b",
                                            },
                                            "& .Mui-focused label": {
                                                color: "#28292b",
                                            },
                                            width: '92%',
                                            borderRadius: '8px',
                                            textDecoration: 'none',
                                            marginBottom: '16px',
                                        }}
                                        style={{ backgroundColor: 'var(--seventh-color)', }}
                                        required
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                onKeyPress={(event) => {
                                                    const regex = /^[A-Za-z\s]+$/;
                                                    if (!regex.test(event.key)) {
                                                        event.preventDefault();
                                                    }
                                                }}
                                                variant="standard"
                                                sx={{
                                                    '& .MuiInputBase-input': {
                                                        fontSize: '14px',
                                                        lineHeight: '1.2',
                                                        padding: '4px 8px',
                                                    },
                                                    '& .MuiOutlinedInput-root': {
                                                        height: '36px',
                                                    },
                                                    '& .MuiInput-underline:before': {
                                                        borderBottom: 'none',
                                                    },
                                                    '& .MuiInput-underline:after': {
                                                        borderBottom: 'none',
                                                    },
                                                    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                                                        borderBottom: 'none',
                                                    },
                                                    "& .MuiInputLabel-root": {
                                                        color: "#28292b",
                                                    },
                                                    "& .Mui-focused label": {
                                                        color: "#28292b",
                                                    },
                                                    width: '92%',
                                                    marginLeft: '12px',
                                                    borderRadius: '8px',
                                                    textDecoration: 'none',
                                                }}
                                                style={{ backgroundColor: 'var(--seventh-color)', }}
                                            />
                                        )}
                                        renderOption={(props, option) => (
                                            <li {...props} key={option.id}>
                                                <span>{option.nome}</span>
                                            </li>
                                        )}
                                    />
                                </div>
                                <div className='valor-quantidade-produto'>
                                    <div className='valor-produto'>
                                        <p>Valor:</p>
                                        <TextField
                                            value={dadosFormProduct.valorProduto}
                                            size="small"
                                            variant="standard"
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment
                                                        sx={{ marginTop: '-11px', outline: 'none', pointerEvents: 'none' }}
                                                        position="start"
                                                    >
                                                        <Typography
                                                            sx={{
                                                                outline: 'none',
                                                                marginBottom: '11px',
                                                                pointerEvents: 'none',
                                                            }}
                                                            style={{
                                                                backgroundColor: 'var(--seventh-color)',
                                                                color: 'var(--third-color)',
                                                            }}
                                                        >
                                                            ETC$:
                                                        </Typography>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            type="number"
                                            min="1"
                                            sx={{
                                                '& .MuiInputBase-input': {
                                                    fontSize: '14px',
                                                    lineHeight: '1.2',
                                                    padding: '4px 8px',
                                                    outline: 'none',
                                                    pointerEvents: 'none',
                                                },
                                                '& .MuiOutlinedInput-root': {
                                                    height: '36px',
                                                    outline: 'none',
                                                    pointerEvents: 'none',
                                                },
                                                '& .MuiInput-underline:before': {
                                                    borderBottom: 'none',
                                                    outline: 'none',
                                                    pointerEvents: 'none',
                                                },
                                                '& .MuiInput-underline:after': {
                                                    borderBottom: 'none',
                                                    outline: 'none',
                                                    pointerEvents: 'none',
                                                },
                                                '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                                                    borderBottom: 'none',
                                                    outline: 'none',
                                                    pointerEvents: 'none',
                                                },
                                                marginLeft: '12px',
                                                borderRadius: '8px',
                                                textDecoration: 'none',
                                                outline: 'none',
                                                pointerEvents: 'none',
                                            }}
                                            style={{ backgroundColor: 'var(--seventh-color)', }}
                                            required
                                        />
                                    </div>
                                    <div className='quantidade-produto'>
                                        <p>Quantidade:</p>
                                        <TextField
                                            value={dadosFormProduct.quantidade}
                                            name="quantidade"
                                            onChange={handleChange}
                                            size="small"
                                            variant="standard"
                                            type="number"
                                            onKeyPress={(event) => {
                                                const regex = /^[^eE\-,]+$/;
                                                if (!regex.test(event.key)) {
                                                    event.preventDefault();
                                                }
                                            }}
                                            inputProps={{
                                                min: 1,
                                            }}
                                            sx={{
                                                '& .MuiInputBase-input': {
                                                    fontSize: '14px',
                                                    lineHeight: '1.2',
                                                    padding: '4px 8px',
                                                },
                                                '& .MuiInput-underline:before': {
                                                    borderBottom: 'none',
                                                },
                                                '& .MuiInput-underline:after': {
                                                    borderBottom: 'none',
                                                },
                                                '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                                                    borderBottom: 'none',
                                                },
                                                "& .MuiOutlinedInput-root": {
                                                    height: '36px',
                                                    "& fieldset": {
                                                        borderColor: "#28292b",
                                                    },
                                                    "&.Mui-focused fieldset": {
                                                        borderColor: "#28292b",
                                                    },
                                                },
                                                "& .MuiInputLabel-root": {
                                                    color: "#28292b",
                                                },
                                                "& .Mui-focused label": {
                                                    color: "#28292b",
                                                },
                                                margin: '0 12px 0 12px',
                                                backgroundColor: 'var(--seventh-color)',
                                                borderRadius: '8px',
                                                textDecoration: 'none',
                                            }}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='categoria-produto'>
                                <p>Categoria do produto</p>
                                <TextField
                                    value={dadosFormProduct.categoriaProduto}
                                    size="small"
                                    variant="standard"
                                    sx={{
                                        '& .MuiInputBase-input': {
                                            fontSize: '14px',
                                            lineHeight: '1.2',
                                            padding: '4px 8px',
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            height: '36px',
                                        },
                                        '& .MuiInput-underline:before': {
                                            borderBottom: 'none',
                                        },
                                        '& .MuiInput-underline:after': {
                                            borderBottom: 'none',
                                        },
                                        '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                                            borderBottom: 'none',
                                        },
                                        "& .MuiInputLabel-root": {
                                            color: "#28292b",
                                        },
                                        "& .Mui-focused label": {
                                            color: "#28292b",
                                        },
                                        width: '90%',
                                        backgroundColor: 'var(--seventh-color)',
                                        borderRadius: '8px',
                                        textDecoration: 'none',
                                        outline: 'none'
                                    }}
                                    required
                                    disabled
                                />
                                <p>Subcategoria do produto</p>
                                <TextField
                                    value={dadosFormProduct.subcategoriaProduto}
                                    size="small"
                                    variant="standard"
                                    sx={{
                                        '& .MuiInputBase-input': {
                                            fontSize: '14px',
                                            lineHeight: '1.2',
                                            padding: '4px 8px',
                                        },
                                        '& .MuiOutlinedInput-root': {
                                            height: '36px',
                                        },
                                        '& .MuiInput-underline:before': {
                                            borderBottom: 'none',
                                        },
                                        '& .MuiInput-underline:after': {
                                            borderBottom: 'none',
                                        },
                                        '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                                            borderBottom: 'none',
                                        },
                                        "& .MuiInputLabel-root": {
                                            color: "#28292b",
                                        },
                                        "& .Mui-focused label": {
                                            color: "#28292b",
                                        },
                                        width: '90%',
                                        backgroundColor: 'var(--seventh-color)',
                                        borderRadius: '8px',
                                        textDecoration: 'none',
                                        outline: 'none',
                                        marginBottom: '62px'
                                    }}
                                    required
                                    disabled
                                />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            startIcon={<SellIcon />}
                            variant="contained"
                            sx={{
                                backgroundColor: 'var(--third-color)',
                                width: '30%',
                                height: '36px',
                                textTransform: 'none',
                                borderRadius: '1rem',
                                marginTop: '16px',
                                marginLeft: '70%',
                            }}
                        >
                            Vender produto
                        </Button>
                    </form>
                    {open && <AdicionarCategoria categorias={categorias} subCategorias={subCategorias} fetchCategorias={fetchCategorias} fetchSubCategorias={fetchSubCategorias} open={open} setOpen={setOpen} handleCloseBackdrop={handleCloseBackdrop} dadosFormProduct={dadosFormProduct} setDadosFormProduct={setDadosFormProduct} />}
                </div>

                <div className='box-comanda'>
                    <FormUserSealing total={total} setTotal={setTotal} carrinho={carrinho} setCarrinho={setCarrinho} />
                </div>
            </div>


            <div className='box-carrinho'>
                {/* // * Botão de switch para escolher como serão mostrados os produtos */}

                {/* // * Barra de pesquisa (talvez sim, talvez não), não tem muita utilidade */}

                {/* // * Botão de Sort By */}

                <Carrinho carrinho={carrinho} setCarrinho={setCarrinho} />
            </div>

            <div onClick={(e) => e.stopPropagation()} >
                <Alerta state={openAlertAmountProduct} onClose={handleCloseBackdropButton} text="Quantidade solicitada excede o estoque disponível" severity="warning" />
            </div>
            <div onClick={(e) => e.stopPropagation()} >
                <Alerta state={openAlertAmount} onClose={handleCloseBackdropButton} text="Selecione um produto primeiramente" severity="info" />
            </div>
        </div>
    )
}

import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import '../FormProduct/Carrinho/Carrinho.css';

const Carrinho = ({ carrinho, setCarrinho }) => {
    return (
        <div className="carrinho">
            <h2>Carrinho</h2>
            {carrinho.length === 0 ? (
                <p>O carrinho está vazio.</p>
            ) : (
                <div className="carrinhoProd">
                    {carrinho.map((produto, index) => (
                        <div key={index} className="boxProduct">
                            <p>Nome: {produto.nomeProduto}</p>
                            <p>ETC$ {produto.valorProduto}</p>
                            <p>Quantidade: {produto.quantidade}</p>
                            <p>Categoria: {produto.categoriaProduto}</p>
                            <p>Subcategoria: {produto.subcategoriaProduto}</p>
                            <div className="carHeader">
                                <Button
                                    onClick={() => {
                                        const novoCarrinho = carrinho.filter((_, i) => i !== index);
                                        setCarrinho(novoCarrinho);
                                        localStorage.setItem("carrinho", JSON.stringify(novoCarrinho));
                                    }}
                                    variant="outlined"
                                    sx={{ color: "red", border: 'none', textTransform: 'none', fontSize: '1rem' }}
                                    startIcon={<DeleteForeverIcon />}
                                >
                                    Cancelar
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export { Carrinho, FormSealing };

