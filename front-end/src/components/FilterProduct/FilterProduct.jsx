/* eslint-disable react/prop-types */
import axios from 'axios';
import { useEffect, useState } from 'react';

import Box from "@mui/material/Box";
import Button from '@mui/material/Button';
import Chip from "@mui/material/Chip";
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import ListSubheader from "@mui/material/ListSubheader";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import RestoreIcon from '@mui/icons-material/Restore';
import SearchIcon from '@mui/icons-material/Search';
import SortByAlphaIcon from '@mui/icons-material/SortByAlpha';

import { ProductEstoque } from "../../components/ProductEstoque/ProductEstoque.jsx";

import "./FilterProduct.css";

const FilterProduct = ({ produtos, setProdutos, box }) => {
    // * PEGANDO AS CATEGORIAS E SUBCATEGORIAS
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

    // * PROCURAR PRODUTOS
    const [produtoSearch, setProdutoSearch] = useState("")

    const handleChangeSearchProdutos = (e) => {
        setProdutoSearch(e.target.value)
    }

    // * STATUS DO PRODUTO
    const [activeButton, setActiveButton] = useState("Todos");

    const filterProductsByStatus = (status) => {
        if (status === "Ativado") {
            return produtos.filter(produto => produto.estoqueStatus === 0);
        } else if (status === "Desativado") {
            return produtos.filter(produto => produto.estoqueStatus === 1);
        } else if (status === "Todos") {
            return produtos;
        }
    };

    const handleButtonClick = (status) => {
        setActiveButton(status);
    };

    // * ORDENAÇÃO DE PRODUTOS
    const [sortOrder, setSortOrder] = useState('a-z');

    const alfabeto = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

    const sortProducts = (products) => {
        return [...products].sort((a, b) => {
            const firstLetterA = a.nome[0].toUpperCase();
            const firstLetterB = b.nome[0].toUpperCase();
            const comparison = alfabeto.indexOf(firstLetterA) - alfabeto.indexOf(firstLetterB);
            return sortOrder === 'a-z' ? comparison : -comparison;
        });
    };

    const handleChange = (event) => {
        setSortOrder(event.target.value);
    };

    // * INICIALIZAR PRODUTOS ORDENADOS
    const sortedProducts = sortProducts(filterProductsByStatus(activeButton));

    // * VALOR MÁXIMO E MÍNIMO
    const [minPrice, setMinPrice] = useState(null);
    const [maxPrice, setMaxPrice] = useState(null);

    const valor = { min: minPrice, max: maxPrice };

    // * CATEGORIAS SELECIONADAS
    const [selectedChips, setSelectedChips] = useState([]);

    const handleChipClick = (cat) => {
        if (selectedChips.includes(cat)) {
            setSelectedChips(selectedChips.filter((selectCat) => selectCat !== cat));
        } else {
            setSelectedChips([...selectedChips, cat]);
        }
    };

    // * SUBCATEGORIAS SELECIONADAS
    const [subcategorias, setSubcategorias] = useState([])

    const handleChangeSubcategoria = (e) => {
        const { value } = e.target;

        setSubcategorias(
            typeof value === 'string' ? value.split(',') : value,
        );
    }

    // * PRODUTOS ATIVADOS E DESATIVADOS
    let isActivated = 0;
    let isDisabled = 0;

    produtos.forEach((value) => {
        if (value.estoqueStatus === 0) {
            isActivated++;
        } else {
            isDisabled++;
        }
    });

    // * RESETAR FILTROS
    const resetFilter = () => {
        setActiveButton("Todos");
        setSelectedChips([])
        setSubcategorias([])
        setSortOrder('a-z');
        setMinPrice(null);
        setMaxPrice(null);
    }

    return (
        <div className="container-estoque">
            <div className="content">
                <div className="box-filter-product">
                    <p>PROCURAR PRODUTOS</p>
                    <div className='container-filter'>
                        <TextField
                            name="searchProdutos"
                            size="small"
                            sx={{
                                width: '100%'
                            }}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            onChange={handleChangeSearchProdutos}
                        />
                    </div>

                    <p>STATUS DO PRODUTO</p>
                    <div className='container-filter'>
                        {["Todos", "Ativado", "Desativado"].map((status, index) => (
                            <Button
                                key={index}
                                variant={activeButton === status ? "contained" : "outlined"}
                                onClick={() => handleButtonClick(status)}
                                sx={{
                                    minWidth: "147px",
                                }}
                                style={{
                                    color: activeButton === status ? "var(--primary-color)" : "var(--third-color)",
                                    borderColor: "var(--third-color)",
                                    backgroundColor: activeButton === status ? "var(--third-color)" : "transparent"
                                }}
                            >
                                {status} ({[produtos && produtos.length, isActivated, isDisabled][index]})
                            </Button>
                        ))}
                    </div>

                    <p>CATEGORIAS</p>
                    <div className='container-filter'>
                        {categorias.map((cat) => (
                            <Chip
                                key={cat.id}
                                label={cat.nome}
                                onClick={() => handleChipClick(cat)}
                                clickable
                                color={selectedChips.includes(cat) ? "success" : "default"}
                                variant={selectedChips.includes(cat) ? "filled" : "outlined"}
                                sx={{ cursor: "pointer" }}
                            />
                        ))}
                    </div>

                    <p>SUBCATEGORIAS</p>
                    <div className='container-filter'>
                        <FormControl
                            sx={{
                                width: '100%'
                            }}
                        >
                            <Select
                                multiple
                                value={subcategorias}
                                onChange={handleChangeSubcategoria}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value) => (
                                            <Chip
                                                key={value}
                                                label={value}
                                                sx={{
                                                    margin: '2px',
                                                    color: '#28292b',
                                                }}
                                                style={{ backgroundColor: 'var(--seventh-color)', }}
                                            />
                                        ))}
                                    </Box>
                                )}
                            >
                                {selectedChips.length > 0 ? (
                                    selectedChips.map((categoria) => (
                                        [
                                            <ListSubheader key={`subheader-${categoria.id}`}>{categoria.nome}</ListSubheader>,
                                            ...subCategorias
                                                .filter((sub) => sub.categoriaID === categoria.id)
                                                .map((value) => (
                                                    <MenuItem key={value.id} value={value.nome}>
                                                        {value.nome}
                                                    </MenuItem>
                                                ))
                                        ]
                                    ))
                                ) : (
                                    <MenuItem value="">Selecione uma categoria</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </div>

                    <p>ORDENAR POR</p>
                    <FormControl
                        sx={{
                            minWidth: '96%',
                            padding: '4px 0 4px 0',
                            marginBottom: '2rem',
                        }}
                    >
                        <Select
                            value={sortOrder}
                            onChange={handleChange}
                            sx={{
                                textAlign: 'right',
                            }}
                            startAdornment={
                                <InputAdornment position="start">
                                    <SortByAlphaIcon sx={{ color: 'gray' }} />
                                </InputAdornment>
                            }
                        >
                            <MenuItem value="a-z">A-Z</MenuItem>
                            <MenuItem value="z-a">Z-A</MenuItem>
                        </Select>
                    </FormControl>

                    <p>PREÇO</p>
                    <div className='price-container'>
                        <TextField
                            variant="outlined"
                            placeholder="Preço mínimo"
                            value={minPrice !== null ? minPrice : ''}
                            onChange={(e) => setMinPrice(e.target.value ? parseInt(e.target.value, 10) : null)}
                            type="number"
                            min="1"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Typography
                                            sx={{
                                                position: 'relative',
                                                top: '4px',
                                            }}
                                            style={{ color: 'var(--third-color)', }}
                                        >
                                            ETC$:
                                        </Typography>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                borderRadius: '8px',
                                input: { color: '#000' },
                            }}
                        />

                        <TextField
                            variant="outlined"
                            placeholder="Preço máximo"
                            value={maxPrice !== null ? maxPrice : ''}
                            onChange={(e) => setMaxPrice(e.target.value ? parseInt(e.target.value, 10) : null)}
                            type="number"
                            min="1"
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Typography
                                            sx={{
                                                position: 'relative',
                                                top: '4px',
                                            }}
                                            style={{ color: 'var(--third-color)', }}
                                        >
                                            ETC$:
                                        </Typography>
                                    </InputAdornment>
                                ),
                            }}
                            sx={{
                                borderRadius: '8px',
                                input: { color: '#000' },
                            }}
                        />
                    </div>

                    <div className='reset-filters'>
                        <Button
                            variant="contained"
                            sx={{
                                textTransform: 'none',
                                borderRadius: '1rem'
                            }}
                            style={{ backgroundColor: 'var(--third-color)', }}
                            startIcon={<RestoreIcon />}
                            onClick={resetFilter}
                        >
                            Resetar Filtros
                        </Button>
                    </div>
                </div>
            </div>
            <ProductEstoque produtos={sortedProducts} setProdutos={setProdutos} categorias={selectedChips.length > 0 ? selectedChips : categorias} subCategorias={subCategorias} subcategorias={subcategorias} valor={valor} produtoSearch={produtoSearch} box={box} />
        </div>
    )
}

export default FilterProduct
