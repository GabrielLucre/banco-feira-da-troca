const sequelize = require('../config/mysql/database');
const initModels = require('../models/init-models').initModels
const models = initModels(sequelize)
const log = require('../utils/logger')
const { fn } = require('sequelize')
const {LogTrans} = require('../controllers/transitionController')

exports.models = models

const getProdutos = async (req, res) => {
    const produto = await models.produtos.findAll()
    res.status(200).json(produto)
    log("INFO", "Query produtos executada com sucesso!")
}

const getCaixas = async (req, res) => {
    const caixa = await models.caixas.findAll()
    res.status(200).json(caixa)
    log("INFO", "Query caixas executada com sucesso!")
}

// receber
const postProdutos = async (req, res) => {
    try {
        const { produtos, comandaId, tipo } = req.body

        if (!produtos || produtos.length === 0) {
            return res.status(400).json({ error: "Nenhum produto enviado." })
        }

        const produtosCadastrados = await models.produtos.bulkCreate(
            produtos.map((produto) => ({
                nome: produto.nome,
                subcategoriaID: produto.subcategoriaID,
                valor: produto.valor,
                estoqueStatus: 0,
                vendaStatus: 0,
                data: fn('CURDATE')
            }))
        )

        LogTrans(produtos, comandaId, tipo)

        res.status(200).json({
            message: "Produtos cadastrados com sucesso.",
            produtos: produtosCadastrados,
        })
        // log("INFO", "Produtos adicionados com sucesso!", produtos)
    } catch (error) {
        console.warn(error)
        // log("ERROR", "Erro ao adicionar produtos.", error)
        res.status(500).json({ error: "Erro interno do servidor." })
    }
}

const postCaixas = async (req, res) => {
    try {
        const { status, turmaID, produtos, valorCaixa } = req.body;

        if (!Array.isArray(produtos) || produtos.length === 0) {
            return res.status(400).json({
                error: "É necessário enviar um array de produtos para associar à caixa.",
            });
        }

        // Validação se a turma existe
        const turmaExistente = await models.turmas.findByPk(turmaID);
        if (!turmaExistente) {
            return res.status(400).json({
                error: "A turma informada não foi encontrada.",
            });
        }

        // Cria a caixa
        const caixaCadastrada = await models.caixas.create({
            status: status,
            turmaID: turmaExistente.id,
            valor: valorCaixa
        });

        // Atualiza os produtos com caixaID e estoqueStatus
        await Promise.all(
            produtos.map(async (prod) => {
                const produto = await models.produtos.findByPk(prod.id);
                if (produto) {
                    await produto.update({
                        caixaID: caixaCadastrada.id,
                        estoqueStatus: 1,
                    });
                } else {
                    console.warn(`Produto com ID ${prod.id} não encontrado.`);
                }
            })
        );

        res.status(200).json({
            message: "Caixa cadastrada com sucesso e produtos atualizados.",
            caixa: caixaCadastrada,
        });
    } catch (error) {
        console.warn(error);
        res.status(500).json({ error: "Erro interno do servidor." });
    }
};

const editarCaixas = async (req, res) => {
    const { id } = req.params
    const { status, turmaID } = req.body
    try {
        const caixa = await models.caixas.findByPk(id)
        if (!caixa) {
            return res.status(404).json({ error: 'Caixa não encontrada.' })
        }
        const caixaAtualizada = await caixa.update({
            status,
            turmaID
        })
        res.status(201).json(caixaAtualizada)
        log("INFO", "Caixa editada com sucesso.", id)
    } catch (e) {
        console.error(e)
        res.status(500).json({ error: e.message })
    }
}

const editarProdutos = async (req, res) => {
    const { ids, produtos, comandaId, tipo } = req.body; // Agora, os IDs vêm do corpo da requisição.

    try {
        // Atualizando o vendaStatus para 0 em todos os produtos que têm seus IDs na lista
        const [updatedRows] = await models.produtos.update(
            { vendaStatus: 1 },  // Atualizando o status de venda para 0
            {
                where: {
                    id: ids, // Filtrando pelos IDs dos produtos passados no corpo da requisição
                },
            }
        );

        if (updatedRows > 0) {
            LogTrans(produtos, comandaId, tipo)

            // Log de transação
            log("INFO", `${updatedRows} produto(s) editado(s) com sucesso.`, ids);
            res.status(200).json({ message: "Produtos atualizados com sucesso." });
        } else {
            res.status(404).json({ error: "Nenhum produto encontrado para atualizar." });
        }
    } catch (error) {
        console.warn(error);
        res.status(500).json({ error: "Erro interno do servidor." });
    }
}

module.exports = { getProdutos, postProdutos, editarProdutos, postCaixas, editarCaixas, getCaixas }