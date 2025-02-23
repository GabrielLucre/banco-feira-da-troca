/* eslint-disable react/prop-types */
import axios from 'axios';
import { useEffect, useState } from 'react';

import AdicionarCategoria from '../AdicionarCategoria/AdicionarCategoria.jsx';
import FormUser from '../FormUser/FormUser.jsx';

import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CategoryIcon from '@mui/icons-material/Category';

import "./FormProduct.css";

const FormProduct = () => {
    // * Dados do Formulário
    const [dadosFormProduct, setDadosFormProduct] = useState({
        nomeProduto: "",
        valorProduto: "",
        quantidade: "",
        categoriaProduto: "",
        subcategoriaProduto: "",
    })

    const handleChange = (e) => {
        const { name, value } = e.target

        setDadosFormProduct((prev) => ({
            ...prev,
            [name]: value.toUpperCase(),
        }))
    }

    const handleChangeSubcategoriaAndValor = (e) => {
        const { name, value } = e.target
        const subcategoriasSelecionada = subCategorias.find(subcategoria => subcategoria.nome === value)

        setDadosFormProduct((prev) => ({
            ...prev,
            [name]: value,
            valorProduto: subcategoriasSelecionada.valor
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        adicionarAoCarrinho(dadosFormProduct)
    };

    // * Pegando as categorias e subcategorias
    const [categorias, setCategorias] = useState([])
    const [subCategorias, setSubCategorias] = useState([])

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

    useEffect(() => {
        fetchCategorias()
        fetchSubCategorias()
    }, [])

    // * Limpa a subcategoriae valor sempre que a categoria mudar
    useEffect(() => {
        setDadosFormProduct(prevState => ({
            ...prevState,
            subcategoriaProduto: "",
            valorProduto: ""
        }));
    }, [dadosFormProduct.categoriaProduto]);

    // * Botão de adicionar categoria
    const [open, setOpen] = useState(false)

    const handleOpenAddCategory = () => {
        setOpen(true)
    }

    const handleCloseBackdrop = () => {
        setOpen(false)
    }

    // * Carrinho
    const adicionarAoCarrinho = (produto) => {
        const subcategoriaProduto = subCategorias.find(sub => sub.nome === produto.subcategoriaProduto);

        const quantidadeProduto = parseInt(produto.quantidade, 10);

        const produtoExistente = carrinho.find(item => item.nomeProduto === produto.nomeProduto && item.subcategoriaID === subcategoriaProduto.id);

        if (produtoExistente) {
            const novaQuantidade = parseInt(produtoExistente.quantidade, 10) + quantidadeProduto;

            const carrinhoAtualizado = carrinho.map(item =>
                item.nomeProduto === produto.nomeProduto && item.subcategoriaID === subcategoriaProduto.id
                    ? { ...item, quantidade: novaQuantidade.toString() }
                    : item
            );

            setCarrinho(carrinhoAtualizado);
            localStorage.setItem("carrinho", JSON.stringify(carrinhoAtualizado));
        } else {
            const novoCarrinho = [...carrinho, { ...produto, quantidade: quantidadeProduto.toString(), subcategoriaID: subcategoriaProduto.id }];
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

        const totalCalculado = carrinhoSalvo.reduce(
            (acc, carro) => acc + Number(carro.valorProduto * carro.quantidade), 0
        );

        setTotal(totalCalculado);
    }, []);

    useEffect(() => {
        const totalCalculado = carrinho.reduce(
            (acc, carro) => acc + Number(carro.valorProduto * carro.quantidade), 0
        );

        setTotal(totalCalculado);
    }, [carrinho]);

    useEffect(() => {
        document.querySelectorAll('input').forEach(input => {
            input.setAttribute('autocomplete', 'off');
        });
    }, []);

    return (
        <div className='box-form-comanda-carrinho'>
            <div className='content-product'>
                <div className='form-product'>
                    <h1>Adicionar produto</h1>
                    <form onSubmit={handleSubmit} autoComplete="off">
                        <div className='box-form-product'>
                            <div className='left-container'>
                                <div className='nome-produto'>
                                    <p>Nome do Produto:</p>
                                    <TextField
                                        value={dadosFormProduct.nomeProduto}
                                        name="nomeProduto"
                                        onChange={handleChange}
                                        onKeyPress={(event) => {
                                            const regex = /^[A-Z\s]+$/;
                                            if (!regex.test(event.key)) {
                                                event.preventDefault();
                                            }
                                        }}
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
                                            width: '92%',
                                            borderRadius: '8px',
                                            textDecoration: 'none',
                                            marginBottom: '16px',
                                        }}
                                        style={{ backgroundColor: 'var(--seventh-color)', }}
                                        required
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
                                                        sx={{ marginTop: '-11px', outline: 'none', }}
                                                        position="start"
                                                    >
                                                        <Typography
                                                            sx={{
                                                                outline: 'none',
                                                                marginBottom: '11px',
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
                                                },
                                                '& .MuiOutlinedInput-root': {
                                                    height: '36px',
                                                    outline: 'none',
                                                },
                                                '& .MuiInput-underline:before': {
                                                    borderBottom: 'none',
                                                    outline: 'none',
                                                },
                                                '& .MuiInput-underline:after': {
                                                    borderBottom: 'none',
                                                    outline: 'none',
                                                },
                                                '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                                                    borderBottom: 'none',
                                                    outline: 'none',
                                                },
                                                '& .Mui-disabled': {
                                                    borderBottom: 'none',
                                                    outline: 'none',
                                                    borderRadius: '8px',
                                                },
                                                marginLeft: '12px',
                                                borderRadius: '8px',
                                                textDecoration: 'none',
                                                outline: 'none',
                                                '&:focus': {
                                                    outline: 'none',
                                                    boxShadow: 'none',
                                                },
                                                '&:active': {
                                                    outline: 'none',
                                                },
                                            }}
                                            style={{ backgroundColor: 'var(--seventh-color)', }}
                                            required
                                            disabled
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
                                                borderRadius: '8px',
                                                textDecoration: 'none',
                                            }}
                                            style={{ backgroundColor: 'var(--seventh-color)', }}
                                            required
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='categoria-produto'>
                                <p>Categoria do produto</p>
                                <FormControl
                                    size="small"
                                    variant="standard"
                                    sx={{
                                        '& .MuiInputBase-input': {
                                            fontSize: '14px',
                                            lineHeight: '1.2',
                                            padding: '5px 8px 3px',
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
                                        width: '90%',
                                        borderRadius: '8px',
                                        textDecoration: 'none',
                                    }}
                                    style={{ backgroundColor: 'var(--seventh-color)', }}
                                    required
                                >
                                    <Select
                                        value={dadosFormProduct.categoriaProduto}
                                        name="categoriaProduto"
                                        onChange={handleChange}
                                    >
                                        {categorias ? categorias.map((value) => (
                                            <MenuItem key={value.id} value={value.nome}>{value.nome}</MenuItem>
                                        )) : <MenuItem value="">Selecione uma categoria</MenuItem>}
                                    </Select>
                                </FormControl>
                                <p>Subcategoria do produto</p>
                                <FormControl
                                    size="small"
                                    variant="standard"
                                    sx={{
                                        '& .MuiInputBase-input': {
                                            fontSize: '14px',
                                            lineHeight: '1.2',
                                            padding: '5px 8px 3px',
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
                                        width: '90%',
                                        borderRadius: '8px',
                                        textDecoration: 'none',
                                    }}
                                    style={{ backgroundColor: 'var(--seventh-color)', }}
                                    required
                                >
                                    <Select
                                        value={dadosFormProduct.subcategoriaProduto}
                                        name="subcategoriaProduto"
                                        onChange={handleChangeSubcategoriaAndValor}
                                    >
                                        {dadosFormProduct.categoriaProduto ? (subCategorias.map((value) => {
                                            const categoriaSelecionada = categorias.find(
                                                (categoria) => categoria.nome === dadosFormProduct.categoriaProduto
                                            )

                                            return categoriaSelecionada && value.categoriaID === categoriaSelecionada.id ? (
                                                <MenuItem key={value.id} value={value.nome}>{value.nome}</MenuItem>
                                            ) : (null)
                                        })) : (
                                            <MenuItem value="">Selecione uma categoria</MenuItem>
                                        )}
                                    </Select>
                                </FormControl>
                                <Button
                                    startIcon={<CategoryIcon />}
                                    variant="contained"
                                    sx={{
                                        width: '90%',
                                        height: '36.5px',
                                        textTransform: 'none',
                                        margin: '10px 0 1rem 0',
                                        borderRadius: '1rem',
                                    }}
                                    style={{ backgroundColor: 'var(--third-color)', }}
                                    onClick={handleOpenAddCategory}
                                >
                                    Adicionar Categoria
                                </Button>
                            </div>
                        </div>
                        <Button
                            type="submit"
                            startIcon={<AddShoppingCartIcon />}
                            variant="contained"
                            sx={{
                                width: '30%',
                                height: '36px',
                                textTransform: 'none',
                                borderRadius: '1rem',
                                marginTop: '16px',
                                marginLeft: '70%',
                            }}
                            style={{ backgroundColor: 'var(--third-color)', }}
                        >
                            Cadastrar produto
                        </Button>
                    </form>
                    {open && <AdicionarCategoria categorias={categorias} subCategorias={subCategorias} fetchCategorias={fetchCategorias} fetchSubCategorias={fetchSubCategorias} open={open} setOpen={setOpen} handleCloseBackdrop={handleCloseBackdrop} dadosFormProduct={dadosFormProduct} setDadosFormProduct={setDadosFormProduct} />}
                </div>

                <div className='box-comanda'>
                    <FormUser subCategorias={subCategorias} total={total} setTotal={setTotal} carrinho={carrinho} setCarrinho={setCarrinho} />
                </div>
            </div>

            <div className='box-carrinho'>
                {/* // * Botão de switch para escolher como serão mostrados os produtos */}

                {/* // * Barra de pesquisa (talvez sim, talvez não), não tem muita utilidade */}

                {/* // * Botão de Sort By */}

                <Carrinho carrinho={carrinho} setCarrinho={setCarrinho} />
            </div>
        </div>
    )
}

import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import './Carrinho/Carrinho.css';

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

export { Carrinho, FormProduct };

