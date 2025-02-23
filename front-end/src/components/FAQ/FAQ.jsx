import { Fragment, useState } from 'react';

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";

import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';

const FAQ = () => {
    const [expanded, setExpanded] = useState({});

    const questions = [
        {
            id: 1,
            question: 'O que é o ETC$ (ETECoin) e como posso ganhar?',
            answer: 'O ETC$ (ETECoin) é a moeda digital fictícia da escola, ela serve para comprar os produtos da feira, para receber elas é bem simples, você só precisa trazer produtos para trocar e elas ficaram quardadas na sua comanda para o dia do evento',
        },
        {
            id: 2,
            question: 'Como funciona a troca de produtos durante o evento?',
            answer: 'Você receberá sua comanda com seus ETC$ entrara em uma sala de seu interesse e chegará no caixa com os produtos que deseja receber, o caixa pegará sua comanda e realizará a troca',
        },
        {
            id: 3,
            question: 'Posso trocar produtos sem ter ETC$?',
            answer: 'Não, a Feira da Troca se baseia em troca de produtos por meio da moeda fictícia da escola mas, com os produtos que você trazer, ganhará ETC$ em troca por eles',
        },
        {
            id: 4,
            question: 'Como posso saber quanto ETC$ eu tenho na minha comanda?',
            answer: 'No site do Banco da Feira da Troca, lá haverá sua comanda com a quantidade de ETC$ que você possui, alem disso, no dia do evento haverá computadores em locais específicos para checar a quantidade de ETC$ ou realizar uma troca de creditos entre comandas',
        },
        {
            id: 5,
            question: 'Posso ter mais de uma comanda?',
            answer: 'Não, mas é possível trocar créditos entre comandas no dia do evento',
        },
        {
            id: 6,
            question: 'O que acontece se eu não usar todo o ETC$ que eu tenho?',
            answer: 'Todo ETC$ que sobrar será convertido em produtos que serão levados para instituições carentes',
        },
        {
            id: 7,
            question: 'O que posso fazer se perder a minha comanda?',
            answer: 'Procure um funcionário da escola para que você seja direcionado para confirmação dos dados e receber uma nova comanda',
        },
        {
            id: 8,
            question: 'Posso verificar o saldo da minha comanda enquanto estou no caixa?',
            answer: 'Sim, os caixas podem checar seu saldo da comanda',
        },
        {
            id: 9,
            question: 'E se eu não tiver ETC$ suficiente para pagar pelos produtos?',
            answer: 'Infelizmente terá que deixar alguns produtos para trás',
        },
        {
            id: 10,
            question: 'Há um limite de ETC$ que posso gastar no evento?',
            answer: 'Não, você é livre para realizar quantas trocas quiser',
        },
        {
            id: 11,
            question: 'O sistema funciona sem internet?',
            answer: 'Não, é preciso acessar rede Wi-fi para acessar o site mas, no dia haverá Wi-fi gratis e há muitas pessoas que se disponibilizariam para te ajudar',
        },
        {
            id: 12,
            question: 'Posso transferir ETC$ para outra pessoa?',
            answer: 'Sim, tanto pelo site e no dia do evento',
        },
    ];

    const handleExpandClick = (id) => {
        setExpanded((prevState) => ({
            ...prevState,
            [id]: !prevState[id],
        }));
    };

    return (
        <div>
            <TableContainer sx={{ marginBottom: '1rem' }}>
                <Table>
                    <TableBody>
                        {questions.map((question) => (
                            <Fragment key={question.id}>
                                <TableRow>
                                    <TableCell sx={{ borderBottom: 'none', textAlign: 'left' }}>
                                        <IconButton
                                            sx={{ height: '1.8rem', width: '1.8rem', marginRight: '0.5rem' }}
                                            onClick={() => handleExpandClick(question.id)}
                                        >
                                            {expanded[question.id] ? <ExpandLess /> : <ExpandMore />}
                                        </IconButton>
                                        {question.question}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell colSpan={2} sx={{ paddingBottom: 0, paddingTop: 0, borderBottom: 'none' }}>
                                        <Collapse in={expanded[question.id]} timeout="auto" unmountOnExit>
                                            <Table size="small">
                                                <TableBody sx={{ display: 'flex' }}>
                                                    <TableRow>
                                                        <TableCell sx={{ borderBottom: 'none' }}>
                                                            {question.answer}
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
        </div>
    )
}

export default FAQ
