/* eslint-disable react/prop-types */
import axios from 'axios';
import { Fragment, useEffect, useRef, useState } from 'react';

import Checkbox from '@mui/material/Checkbox';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';

import "./ProductEstoque.css";

import { v4 as uuidv4 } from "uuid";

import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import ClearIcon from '@mui/icons-material/Clear';
import CropFreeIcon from '@mui/icons-material/CropFree';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import SendIcon from '@mui/icons-material/Send';
import ViewInArIcon from '@mui/icons-material/ViewInAr';

import ShortcutsProdutos from '../../components/ShortcutsProdutos/ShortcutsProdutos';
import Alerta from '../Alerta/Alerta';
import FormDeleteBox from '../FormDeleteBox/FormDeleteBox';

import './Caixas/Caixas.css';

const ProductEstoque = ({ produtos, setProdutos, categorias, subCategorias, subcategorias, valor, produtoSearch, box }) => {
    const filteredProdutos = () => {
        // * Se preferir verificar cada indice da string Ex: Input: Calca, em Output: Calça contêm C,A,L e A denovo
        // let searchStr = produtoSearch;
        // let results = [];

        // while (searchStr.length > 0) {
        //     results = produtos.filter((produto) =>
        //         produto.nome.toUpperCase().includes(searchStr.toUpperCase())
        //     );

        //     if (results.length > 0) break;

        //     searchStr = searchStr.slice(0, -1);
        // }

        const searchStr = produtoSearch.toUpperCase();

        const results = produtos.filter((produto) =>
            produto.nome.toUpperCase().includes(searchStr)
        );

        return results.map((produto) => {
            const subcategoriaProduto = subCategorias.find((sub) => {
                const minValue = valor.min !== null ? valor.min : -Infinity;
                const maxValue = valor.max !== null ? valor.max : Infinity;

                const isWithinRange = (sub.valor >= minValue && sub.valor <= maxValue);

                if (subcategorias.length > 0) {
                    return sub.id === produto.subcategoriaID &&
                        subcategorias.some((nome) => nome.toUpperCase() === sub.nome.toUpperCase()) &&
                        isWithinRange;
                } else {
                    return sub.id === produto.subcategoriaID && isWithinRange;
                }
            });

            const categoriaProduto = subcategoriaProduto && categorias.find(
                (cat) => cat.id === subcategoriaProduto.categoriaID
            )

            return categoriaProduto && (
                <TableBody key={produto.id}>
                    <TableRow>
                        <TableCell sx={{ borderBottom: 'none' }}>
                            {produto.estoqueStatus === 0 && (
                                <Checkbox
                                    sx={{ marginLeft: '-1rem', marginRight: '1rem' }}
                                    checked={selectedProdutos.some(item => item.id === produto.id)}
                                    onChange={() => handleSelectProdutos(produto)}
                                    color="success"
                                />
                            )}
                            {produto.nome}
                        </TableCell>
                        <TableCell sx={{ borderBottom: 'none' }}>
                            {categoriaProduto.nome}
                        </TableCell>
                        <TableCell sx={{ borderBottom: 'none' }}>
                            {subcategoriaProduto.nome}
                        </TableCell>
                        <TableCell sx={{ borderBottom: 'none' }}>
                            {subcategoriaProduto.valor}
                        </TableCell>
                    </TableRow>
                </TableBody>
            )
        })
    };

    const [selectedProdutos, setSelectedProdutos] = useState([]);

    const handleSelectProdutos = (produto) => {
        const subcategoriaProduto = subCategorias.find(sub => sub.id === produto.subcategoriaID);
        const categoriaProduto = subcategoriaProduto && categorias.find(cat => cat.id === subcategoriaProduto.categoriaID);

        const produtoComDetalhes = {
            ...produto,
            categoriaNome: categoriaProduto.nome,
            subcategoriaNome: subcategoriaProduto.nome,
        };

        setSelectedProdutos(prev =>
            prev.some(item => item.id === produto.id)
                ? prev.filter(item => item.id !== produto.id)
                : [...prev, produtoComDetalhes]
        );
    };

    return (
        <div className="container-estoque-produtos">
            <div className="estoque-content-produtos">
                <div className="box-produtos-estoque">
                    <p>PRODUTOS</p>
                    <TableContainer sx={{ overflow: 'hidden' }}>
                        <Table>
                            {/* // * Tentei fazer opção de DND (Drag and Drop), não deu certo :( */}
                            {produtoSearch ? filteredProdutos() : produtos.map((produto) => {
                                const subcategoriaProduto = subCategorias.find((sub) => {
                                    const minValue = valor.min !== null ? valor.min : -Infinity;
                                    const maxValue = valor.max !== null ? valor.max : Infinity;

                                    const isWithinRange = (sub.valor >= minValue && sub.valor <= maxValue);

                                    if (subcategorias.length > 0) {
                                        return sub.id === produto.subcategoriaID &&
                                            subcategorias.some((nome) => nome.toUpperCase() === sub.nome.toUpperCase()) &&
                                            isWithinRange;
                                    } else {
                                        return sub.id === produto.subcategoriaID && isWithinRange;
                                    }
                                });

                                const categoriaProduto = subcategoriaProduto && categorias.find(
                                    (cat) => cat.id === subcategoriaProduto.categoriaID
                                )

                                return categoriaProduto && (
                                    <TableBody key={produto.id}>
                                        <TableRow>
                                            <TableCell sx={{ borderBottom: 'none', whiteSpace: 'nowrap' }}>
                                                {produto.estoqueStatus === 0 && (
                                                    <Checkbox
                                                        sx={{ marginLeft: '-1rem', marginRight: '1rem' }}
                                                        checked={selectedProdutos.some(item => item.id === produto.id)}
                                                        onChange={() => handleSelectProdutos(produto)}
                                                        color="success"
                                                    />
                                                )}
                                                {produto.nome}
                                            </TableCell>
                                            <TableCell sx={{ borderBottom: 'none' }}>
                                                {categoriaProduto.nome}
                                            </TableCell>
                                            <TableCell sx={{ borderBottom: 'none' }}>
                                                {subcategoriaProduto.nome}
                                            </TableCell>
                                            <TableCell sx={{ borderBottom: 'none' }}>
                                                {subcategoriaProduto.valor}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                )
                            })}
                        </Table>
                    </TableContainer>
                </div>
            </div>
            <Caixas selectedProdutos={selectedProdutos} setSelectedProdutos={setSelectedProdutos} produtos={produtos} setProdutos={setProdutos} categorias={categorias} subCategorias={subCategorias} box={box} />
        </div>
    )
}

const Caixas = ({ selectedProdutos, setSelectedProdutos, produtos, setProdutos, categorias, subCategorias, box }) => {
    const [caixas, setCaixas] = useState([]);
    const [openAlertBox, setOpenAlertBox] = useState(false);
    const [openAlertShowBox, setOpenAlertShowBox] = useState(false);
    const [openProdutos, setOpenProdutos] = useState(false);
    const [openBox, setOpenBox] = useState(false);
    const [openBoxError, setOpenBoxError] = useState(false);
    const caixasEndRef = useRef();

    const handleCreateBox = () => {
        if (caixas.length < 9) {
            const newId = uuidv4();
            const newCaixas = [...caixas, { id: newId }];

            setCaixas(newCaixas);

            const updatedDadosCaixas = {
                ...dadosCaixas,
                [newId]: { salaCaixa: "", valorCaixa: "" },
            };

            setDadosCaixas(updatedDadosCaixas);

            sessionStorage.setItem('caixas', JSON.stringify(newCaixas));
            sessionStorage.setItem('dadosCaixas', JSON.stringify(updatedDadosCaixas));
        } else {
            setOpenAlertBox(true);
        }
    };

    useEffect(() => {
        const storedCaixas = sessionStorage.getItem('caixas');
        const storedDadosCaixas = sessionStorage.getItem('dadosCaixas');

        if (storedCaixas) {
            setCaixas(JSON.parse(storedCaixas));
        }

        if (storedDadosCaixas) {
            setDadosCaixas(JSON.parse(storedDadosCaixas));
        }
    }, []);

    const [showBox, setShowBox] = useState(false)

    const handleShowBox = () => {
        if (box.length > 0) {
            box.map(box => {
                const produtosCaixa = produtos.filter(prod => prod.caixaID === box.id);
                const produtosInfo = produtosCaixa.map(prod => {
                    const subcategoriaProduto = subCategorias.find((sub) => {
                        return sub.id === prod.subcategoriaID;
                    });

                    const categoriaProduto = subcategoriaProduto && categorias.find(
                        (cat) => cat.id === subcategoriaProduto.categoriaID
                    );

                    return {
                        id: prod.id,
                        nome: prod.nome,
                        estoqueStatus: prod.estoqueStatus,
                        categoriaNome: categoriaProduto ? categoriaProduto.nome : "Sem Categoria",
                        subcategoriaNome: subcategoriaProduto ? subcategoriaProduto.nome : "Sem Subcategoria",
                        valor: subcategoriaProduto ? subcategoriaProduto.valor : 0
                    };
                });

                const newId = uuidv4();

                setCaixas((prevCaixas) => [...prevCaixas, { id: newId }]);

                setDadosCaixas((prev) => ({
                    [newId]: { salaCaixa: box.turmaID, valorCaixa: box.valor, produtos: produtosInfo },
                    ...prev,
                }));

                setShowBox(true)
            })
        } else {
            setOpenAlertShowBox(true)
        }
    }

    const handleCloseBox = () => {
        const caixasAtualizadas = caixas.filter(
            caixa => dadosCaixas[caixa.id]?.produtos?.every(prod => prod.estoqueStatus !== 1)
        );

        setCaixas(caixasAtualizadas);

        const dadosCaixasAtualizados = caixasAtualizadas.reduce((obj, caixa) => {
            obj[caixa.id] = dadosCaixas[caixa.id];
            return obj;
        }, {});

        setDadosCaixas(dadosCaixasAtualizados);

        sessionStorage.setItem('caixas', JSON.stringify(caixasAtualizadas));
        sessionStorage.setItem('dadosCaixas', JSON.stringify(dadosCaixasAtualizados));

        setShowBox(false);
    };

    const handleCloseBackdropButton = () => {
        setOpenAlertBox(false)
        setOpenProdutos(false)
        if (openBox) {
            setOpenBox(false)
            window.location.href = "/estoque"
        }
        setOpenBoxError(false)
        setOpenAlertShowBox(false)
        setOpenConfirm(false)
    }

    const smoothScroll = (target, duration) => {
        if (!caixasEndRef.current || !caixasEndRef.current.parentNode) return;

        const start = caixasEndRef.current.parentNode.scrollTop;
        const end = target.offsetTop;
        const distance = end - start;
        let startTime = null;

        const ease = (t, b, c, d) => {
            t /= d / 2;
            if (t < 1) return (c / 2) * t * t + b;
            t--;
            return (-c / 2) * (t * (t - 2) - 1) + b;
        };

        const animation = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const run = ease(timeElapsed, start, distance, duration);
            caixasEndRef.current.parentNode.scrollTop = run;
            if (timeElapsed < duration) requestAnimationFrame(animation);
        };

        requestAnimationFrame(animation);
    };

    useEffect(() => {
        if (caixas.length > 0 && caixasEndRef.current) {
            smoothScroll(caixasEndRef.current, 1000);
        }
    }, [caixas]);

    const [caixaID, setCaixaID] = useState(null)
    const [saveProducts, setSaveProducts] = useState([])
    const [dadosCaixas, setDadosCaixas] = useState({});

    const handleAddProdutos = (id) => {
        if (selectedProdutos.length > 0 || saveProducts.length > 0) {
            setCaixaID(id);

            const totalValor = selectedProdutos.reduce((acc, produto) => acc + produto.valor, 0);

            const newSaveProducts = [
                ...saveProducts,
                ...selectedProdutos.map((produto) => ({
                    ...produto,
                    caixaID: id,
                })),
            ];

            setSaveProducts(newSaveProducts);

            const updatedDadosCaixas = {
                ...dadosCaixas,
                [id]: {
                    ...dadosCaixas[id],
                    valorCaixa: (dadosCaixas[id]?.valorCaixa || 0) + totalValor,
                    produtos: [...(dadosCaixas[id]?.produtos || []), ...selectedProdutos],
                },
            };

            setDadosCaixas(updatedDadosCaixas);

            setProdutos((prevProdutos) =>
                prevProdutos.filter(
                    (produto) => !selectedProdutos.some((selected) => selected.id === produto.id)
                )
            );

            setSelectedProdutos([]);

            sessionStorage.setItem('dadosCaixas', JSON.stringify(updatedDadosCaixas));
            sessionStorage.setItem('saveProducts', JSON.stringify(newSaveProducts));
        } else {
            setOpenProdutos(true);
        }
    };

    useEffect(() => {
        const storedDadosCaixas = sessionStorage.getItem('dadosCaixas');
        const storedSaveProducts = sessionStorage.getItem('saveProducts');

        if (storedDadosCaixas) {
            setDadosCaixas(JSON.parse(storedDadosCaixas));
        }
        if (storedSaveProducts) {
            setSaveProducts(JSON.parse(storedSaveProducts));
        }
    }, []);

    const handleChange = (id, e) => {
        const { name, value } = e.target;
        setDadosCaixas((prev) => ({
            ...prev,
            [id]: {
                ...prev[id],
                [name]: value,
            },
        }));
    };

    const [openConfirm, setOpenConfirm] = useState(false)

    const confirmDeleteBox = (e, caixaId) => {
        e.preventDefault()

        if (dadosCaixas[caixaId]?.valorCaixa > 0) {
            setOpenConfirm(true)
            setCaixaID(caixaId)
        } else {
            deleteBox(e, caixaId)
        }

    }

    const deleteBox = (e, caixaId) => {
        e.preventDefault();

        const produtosParaVoltar = dadosCaixas[caixaId]?.produtos || [];

        setProdutos((prevProdutos) => [...prevProdutos, ...produtosParaVoltar]);

        const caixasAtualizadas = caixas.filter((caixa) => caixa.id !== caixaId);
        setCaixas(caixasAtualizadas);

        const dadosCaixasAtualizados = { ...dadosCaixas };
        delete dadosCaixasAtualizados[caixaId];
        setDadosCaixas(dadosCaixasAtualizados);

        const updatedSaveProducts = saveProducts.filter(
            (prod) => !produtosParaVoltar.some((produtoParaRemover) => produtoParaRemover.id === prod.id)
        );
        setSaveProducts(updatedSaveProducts);

        sessionStorage.setItem('caixas', JSON.stringify(caixasAtualizadas));
        sessionStorage.setItem('dadosCaixas', JSON.stringify(dadosCaixasAtualizados));
        sessionStorage.setItem('saveProducts', JSON.stringify(updatedSaveProducts));

        setOpenConfirm(false);
    };

    const [expanded, setExpanded] = useState({});

    const handleExpandClick = (id) => {
        setExpanded((prev) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    const handleRestoreProduct = (caixaId, produtoId) => {
        const produtoRemovido = dadosCaixas[caixaId]?.produtos?.find(
            (prod) => prod.id === produtoId
        );

        if (produtoRemovido) {
            setDadosCaixas((prev) => {
                const updatedCaixas = { ...prev };

                updatedCaixas[caixaId].produtos = updatedCaixas[caixaId].produtos.filter(
                    (prod) => prod.id !== produtoId
                );

                updatedCaixas[caixaId].valorCaixa -= produtoRemovido.valor;

                sessionStorage.setItem("dadosCaixas", JSON.stringify(updatedCaixas));

                return updatedCaixas;
            });

            setProdutos((prevProdutos) => [...prevProdutos, produtoRemovido]);

            setSaveProducts((prevSaveProducts) => {
                const updatedSaveProducts = prevSaveProducts.filter(
                    (prod) => prod.id !== produtoId
                );

                sessionStorage.setItem("saveProducts", JSON.stringify(updatedSaveProducts));
                return updatedSaveProducts;
            });
        }
    };

    const handleSubmit = async (e, caixaId) => {
        e.preventDefault();

        if (saveProducts.length > 0) {
            try {
                const response = await axios.post('http://localhost:3000/stock/box/post', {
                    status: 1,
                    turmaID: dadosCaixas[caixaId].salaCaixa,
                    produtos: dadosCaixas[caixaId].produtos,
                    valorCaixa: dadosCaixas[caixaId].valorCaixa
                });

                console.log("Resposta do servidor: ", response.data);

                setCaixas((prev) => prev.filter((caixa) => caixa.id !== caixaId));
                setDadosCaixas((prev) => {
                    const updatedCaixas = { ...prev };
                    delete updatedCaixas[caixaId];
                    return updatedCaixas;
                });
                setSaveProducts((prev) =>
                    prev.filter(prod => prod.caixaID !== caixaId)
                );

                const caixasRestantes = caixas.filter(caixa => caixa.id !== caixaId);
                const dadosCaixasAtualizados = caixasRestantes.reduce((obj, caixa) => {
                    obj[caixa.id] = dadosCaixas[caixa.id];
                    return obj;
                }, {});

                sessionStorage.setItem('caixas', JSON.stringify(caixasRestantes));
                sessionStorage.setItem('dadosCaixas', JSON.stringify(dadosCaixasAtualizados));
                sessionStorage.setItem(
                    'saveProducts',
                    JSON.stringify(saveProducts.filter(prod => prod.caixaID !== caixaId))
                );

                setOpenBox(true);
            } catch (err) {
                console.log(err);
                setOpenBoxError(true);
            }
        } else {
            setOpenProdutos(true);
        }
    };

    const turmaLabels = {
        "1mkt": "1° MKT",
        "2mkt": "2° MKT",
        "3mkt": "3° MKT",
        "1ds": "1° DS",
        "2ds": "2° DS",
        "1adm": "1° ADM",
        "2adm": "2° ADM",
        "3adm": "3° ADM",
    };

    return (
        <div className="right-container-caixas">
            <div className="estoque-content-caixas">
                <div className="box-caixas-estoque">
                    <p id="caixas-title">CAIXAS</p>
                    <div className="add-box">
                        <Button
                            variant="outlined"
                            sx={{
                                borderRadius: '8px',
                                marginTop: '10px',
                                textTransform: 'none',
                                color: 'rgb(114,114,114)',
                                fontSize: '16.1px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                fontWeight: 'bold'
                            }}
                            color="rgb(114, 114, 114)"
                            onClick={handleCreateBox}
                        >
                            <svg
                                viewBox="0 0 70 70"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                style={{ width: '20px', height: '20px' }}
                            >
                                <path
                                    d="M48.125 27.4166L21.875 12.2791M9.5375 20.3L35 35.0291L60.4625 20.3M35 64.4V35M61.25 46.6666V23.3333C61.249 22.3104 60.9789 21.3057 60.467 20.42C59.9551 19.5344 59.2192 18.799 58.3333 18.2875L37.9167 6.62081C37.0299 6.10883 36.024 5.83929 35 5.83929C33.976 5.83929 32.9701 6.10883 32.0833 6.62081L11.6667 18.2875C10.7808 18.799 10.0449 19.5344 9.53301 20.42C9.02108 21.3057 8.75105 22.3104 8.75 23.3333V46.6666C8.75105 47.6896 9.02108 48.6943 9.53301 49.5799C10.0449 50.4656 10.7808 51.201 11.6667 51.7125L32.0833 63.3791C32.9701 63.8911 33.976 64.1607 35 64.1607C36.024 64.1607 37.0299 63.8911 37.9167 63.3791L58.3333 51.7125C59.2192 51.201 59.9551 50.4656 60.467 49.5799C60.9789 48.6943 61.249 47.6896 61.25 46.6666Z"
                                    stroke="rgb(114,114,114)"
                                    strokeWidth="7"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            Criar
                        </Button>
                        {showBox ?
                            <Button
                                variant="outlined"
                                sx={{
                                    borderRadius: '8px',
                                    marginTop: '10px',
                                    textTransform: 'none',
                                    color: 'rgb(114,114,114)',
                                    fontSize: '15.1px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontWeight: 'bold',
                                    width: '6.5rem'
                                }}
                                color="rgb(114, 114, 114)"
                                onClick={handleCloseBox}
                                startIcon={<CropFreeIcon sx={{ width: '24px', height: '24px', marginRight: '7.5px' }} />}
                            >
                                Fechar
                            </Button> :
                            <Button
                                variant="outlined"
                                sx={{
                                    borderRadius: '8px',
                                    marginTop: '10px',
                                    textTransform: 'none',
                                    color: 'rgb(114,114,114)',
                                    fontSize: '15.1px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    fontWeight: 'bold',
                                    width: '6.5rem'
                                }}
                                color="rgb(114, 114, 114)"
                                onClick={handleShowBox}
                                startIcon={<ViewInArIcon sx={{ width: '24px', height: '24px', marginLeft: '1px' }} />}
                            >
                                Mostrar
                            </Button>}
                    </div>
                    <div className="caixas-list">
                        {caixas.map((caixa) => (
                            <form key={caixa.id} onSubmit={(e) => handleSubmit(e, caixa.id)}>
                                <div
                                    className={`caixa-box ${dadosCaixas[caixa.id]?.produtos?.some(prod => prod.estoqueStatus === 1) ? 'disabled-box' : ''}`}
                                    onClick={() => {
                                        if (!dadosCaixas[caixa.id]?.produtos?.some(prod => prod.estoqueStatus === 1)) {
                                            handleAddProdutos(caixa.id);
                                        }
                                    }}
                                >
                                    <div className="caixa">
                                        {dadosCaixas[caixa.id]?.produtos?.length > 0 ? (
                                            <TableContainer sx={{ paddingTop: '2rem', paddingBottom: '1rem', overflowY: 'scroll', msOverflowStyle: 'none', scrollbarWidth: 'none', overflowX: 'hidden' }}>
                                                <Table>
                                                    <TableBody>
                                                        {dadosCaixas[caixa.id].produtos.map((prod) => (
                                                            <Fragment key={prod.id}>
                                                                <TableRow>
                                                                    <TableCell sx={{ borderBottom: 'none', textAlign: dadosCaixas[caixa.id]?.produtos?.some(prod => prod.estoqueStatus === 1) ? 'center' : 'left' }}>
                                                                        {dadosCaixas[caixa.id]?.produtos?.some(prod => prod.estoqueStatus === 1) || (
                                                                            <IconButton
                                                                                sx={{ height: '1.8rem', width: '1.8rem', marginRight: '0.5rem' }}
                                                                                onClick={(e) => (e.stopPropagation(), handleExpandClick(prod.id))}
                                                                            >
                                                                                {expanded[prod.id] ? <ExpandLess /> : <ExpandMore />}
                                                                            </IconButton>
                                                                        )}
                                                                        {prod?.nome || "-"}
                                                                    </TableCell>
                                                                    {dadosCaixas[caixa.id]?.produtos?.some(prod => prod.estoqueStatus === 1) || (
                                                                        <TableCell sx={{ borderBottom: 'none' }}>
                                                                            <IconButton
                                                                                sx={{ height: '1.8rem', width: '1.8rem', marginLeft: '40%' }}
                                                                                onClick={(e) => (e.stopPropagation(), handleRestoreProduct(caixa.id, prod.id))}
                                                                            >
                                                                                <ClearIcon sx={{ fontSize: '1.1rem' }} />
                                                                            </IconButton>
                                                                        </TableCell>
                                                                    )}
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell colSpan={2} sx={{ paddingBottom: 0, paddingTop: 0, borderBottom: 'none' }}>
                                                                        <Collapse in={expanded[prod.id]} timeout="auto" unmountOnExit>
                                                                            <Table size="small">
                                                                                <TableBody sx={{ display: 'flex' }}>
                                                                                    <TableRow>
                                                                                        <TableCell sx={{ borderBottom: 'none' }}>
                                                                                            {prod?.categoriaNome || "-"}
                                                                                        </TableCell>
                                                                                    </TableRow>
                                                                                    <TableRow>
                                                                                        <TableCell sx={{ borderBottom: 'none' }}>
                                                                                            {prod?.subcategoriaNome || "-"}
                                                                                        </TableCell>
                                                                                    </TableRow>
                                                                                    <TableRow>
                                                                                        <TableCell sx={{ borderBottom: 'none' }}>
                                                                                            {prod?.valor || "-"}
                                                                                        </TableCell>
                                                                                    </TableRow>
                                                                                </TableBody>
                                                                            </Table>
                                                                        </Collapse>
                                                                    </TableCell>
                                                                </TableRow>
                                                            </Fragment>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        ) : (
                                            <p
                                                style={{
                                                    opacity: '0.7',
                                                    fontSize: '0.875rem',
                                                    marginTop: '3rem',
                                                }}
                                            >
                                                SELECIONE OS PRODUTOS<br />
                                                QUE GOSTARIA DE<br />
                                                ADICIONAR E CLIQUE<br />
                                                NA CAIXA
                                            </p>
                                        )}
                                    </div>
                                    <div className="container-bottom-box">
                                        <div className="info-caixa">
                                            <p style={{ marginLeft: '14px' }}>Sala:</p>
                                            {dadosCaixas[caixa.id]?.produtos?.some(prod => prod.estoqueStatus === 1) ?
                                                <TextField
                                                    value={turmaLabels[dadosCaixas[caixa.id]?.salaCaixa] || dadosCaixas[caixa.id]?.salaCaixa || ""}
                                                    name="salaCaixa"
                                                    size="small"
                                                    variant="standard"
                                                    sx={{
                                                        '& .MuiInputBase-input': {
                                                            fontSize: '14px',
                                                            lineHeight: '1.2',
                                                            padding: '4px 8px',
                                                            position: 'relative',
                                                            top: '2px',
                                                            borderRadius: '8px',
                                                            textDecoration: 'none',
                                                            outline: 'none',
                                                            color: '#000000 !important',
                                                        },
                                                        '& .Mui-disabled': {
                                                            color: '#000000 !important',
                                                            WebkitTextFillColor: '#000000 !important',
                                                            borderBottom: 'none',
                                                            borderRadius: '8px',
                                                            textDecoration: 'none',
                                                            outline: 'none',
                                                        },
                                                        '& .MuiInput-underline:before': {
                                                            borderBottom: 'none',
                                                            borderRadius: '8px',
                                                            textDecoration: 'none',
                                                            outline: 'none',
                                                        },
                                                        '& .MuiInput-underline:after': {
                                                            borderBottom: 'none',
                                                            textDecoration: 'none',
                                                            outline: 'none',
                                                        },
                                                        '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                                                            borderBottom: 'none',
                                                            textDecoration: 'none',
                                                            outline: 'none',
                                                        },
                                                        width: '90px',
                                                        marginLeft: '10px',
                                                        borderRadius: '8px',
                                                        marginRight: '1rem',
                                                        textDecoration: 'none',
                                                        outline: 'none',
                                                    }}
                                                    style={{ backgroundColor: 'var(--seventh-color)', }}
                                                    required
                                                    disabled
                                                /> :
                                                <FormControl
                                                    size="small"
                                                    variant="standard"
                                                    sx={{
                                                        '& .MuiInputBase-input': {
                                                            fontSize: '14px',
                                                            lineHeight: '1.2',
                                                            padding: '4px 8px',
                                                            position: 'relative',
                                                            top: '2px',
                                                            borderRadius: '8px',
                                                            textDecoration: 'none',
                                                            outline: 'none',
                                                            backgroundColor: 'var(--seventh-color)',
                                                        },
                                                        '& .Mui-disabled': {
                                                            borderBottom: 'none',
                                                            borderRadius: '8px',
                                                            textDecoration: 'none',
                                                            outline: 'none',
                                                            backgroundColor: 'var(--seventh-color)',
                                                        },
                                                        '& .MuiInput-underline:before': {
                                                            borderBottom: 'none',
                                                            borderRadius: '8px',
                                                            textDecoration: 'none',
                                                            outline: 'none',
                                                        },
                                                        '& .MuiInput-underline:after': {
                                                            borderBottom: 'none',
                                                            textDecoration: 'none',
                                                            outline: 'none',
                                                            backgroundColor: 'var(--seventh-color)',
                                                        },
                                                        '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
                                                            borderBottom: 'none',
                                                            textDecoration: 'none',
                                                            outline: 'none',
                                                            backgroundColor: 'var(--seventh-color)',
                                                        },
                                                        width: '90px',
                                                        marginLeft: '10px',
                                                        borderRadius: '8px',
                                                        marginRight: '1rem',
                                                        textDecoration: 'none',
                                                        outline: 'none',
                                                        backgroundColor: 'var(--seventh-color)',
                                                    }}
                                                    style={{ backgroundColor: 'var(--seventh-color)', }}
                                                    required
                                                >
                                                    <Select
                                                        value={dadosCaixas[caixa.id]?.salaCaixa || ""}
                                                        name="salaCaixa"
                                                        onChange={(e) => handleChange(caixa.id, e)}
                                                        onClick={(e) => e.stopPropagation()}
                                                        sx={{
                                                            textDecoration: 'none',
                                                            outline: 'none',
                                                        }}
                                                    >
                                                        {Object.entries(turmaLabels).map(([key, value], index) => (
                                                            <MenuItem
                                                                key={index}
                                                                value={key}
                                                                sx={{
                                                                    textDecoration: 'none',
                                                                    outline: 'none',
                                                                }}
                                                            >
                                                                {value}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>}
                                            <p>Valor:</p>
                                            <TextField
                                                value={dadosCaixas[caixa.id]?.valorCaixa || ""}
                                                name="valorCaixa"
                                                onClick={(e) => e.stopPropagation()}
                                                size="small"
                                                variant="standard"
                                                type="number"
                                                min="1"
                                                InputProps={{
                                                    startAdornment: (
                                                        <InputAdornment
                                                            sx={{ outline: 'none', pointerEvents: 'none' }}
                                                            position="start"
                                                        >
                                                            <Typography
                                                                sx={{
                                                                    outline: 'none',
                                                                    pointerEvents: 'none'
                                                                }}
                                                                style={{ color: 'var(--third-color)', backgroundColor: 'var(--seventh-color)', }}
                                                            >
                                                                $:
                                                            </Typography>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{
                                                    '& .MuiInputBase-input': {
                                                        fontSize: '14px',
                                                        lineHeight: '1.2',
                                                        padding: '4px 0',
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
                                                    width: '80px',
                                                    marginLeft: '10px',
                                                    marginRight: '8px',
                                                    paddingLeft: '8px',
                                                    borderRadius: '8px',
                                                    textDecoration: 'none',
                                                    outline: 'none',
                                                    pointerEvents: 'none',
                                                }}
                                                required
                                                style={{ backgroundColor: 'var(--seventh-color)', }}
                                            />
                                        </div>
                                        {dadosCaixas[caixa.id]?.produtos?.some(prod => prod.estoqueStatus === 1) || (
                                            <div className="buttons-caixa">
                                                <Button
                                                    size="small"
                                                    type="button"
                                                    variant="outlined"
                                                    color="error"
                                                    sx={{ textTransform: 'none', paddingRight: '1rem' }}
                                                    startIcon={<DeleteIcon />}
                                                    onClick={(e) => (e.stopPropagation(), confirmDeleteBox(e, caixa.id))}
                                                >
                                                    Cancelar
                                                </Button>
                                                <Button
                                                    size="small"
                                                    type="submit"
                                                    variant="outlined"
                                                    color="success"
                                                    sx={{ textTransform: 'none', paddingLeft: '1rem' }}
                                                    endIcon={<SendIcon />}
                                                >
                                                    Enviar
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </form>
                        ))}
                        <div ref={caixasEndRef}></div>
                    </div>
                </div>
            </div>
            <ShortcutsProdutos estoque={true} />
            <div onClick={(e) => e.stopPropagation()} >
                <Alerta state={openAlertBox} onClose={handleCloseBackdropButton} text="Limite de caixas por vez foi alcançado" severity="warning" />
            </div>
            <div onClick={(e) => e.stopPropagation()} >
                <Alerta state={openProdutos} onClose={handleCloseBackdropButton} text="Selecione um produto antes de prosseguir" severity="info" />
            </div>
            <div onClick={(e) => e.stopPropagation()} >
                <Alerta state={openBox} onClose={handleCloseBackdropButton} text="Caixa enviada com sucesso" severity="success" />
            </div>
            <div onClick={(e) => e.stopPropagation()} >
                <Alerta state={openBoxError} onClose={handleCloseBackdropButton} text="Ocorreu algum problema ao enviar a caixa" severity="error" />
            </div>
            <div onClick={(e) => e.stopPropagation()} >
                <Alerta state={openAlertShowBox} onClose={handleCloseBackdropButton} text="Não há nenhuma caixa registrada" severity="error" />
            </div>
            <FormDeleteBox openConfirm={openConfirm} handleCloseBackdropButton={handleCloseBackdropButton} deleteBox={deleteBox} caixaID={caixaID} />
        </div >
    )
}

export { Caixas, ProductEstoque };

