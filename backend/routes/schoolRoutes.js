const express = require('express');
const router = express.Router();
const Escola = require('../models/schoolModel');
const db = require('../config/db');
const autenticarToken = require('../middleware/authMiddleware'); // Adicione isso

// POST: Adicionar escola (usa id_usuario do token)
router.post('/addSchools', autenticarToken, (req, res) => {
    const { nome_escola, rua_endereco, fone } = req.body;
    const id_usuario = req.usuario.id_usuario; // extraído do token

    if (!id_usuario || !nome_escola || !rua_endereco || !fone) {
        return res.status(400).json({ erro: 'Preencha todos os campos!' });
    }

    Escola.criar({ id_usuario, nome_escola, rua_endereco, fone }, (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ erro: 'Nome da escola já cadastrado.' });
            }
            return res.status(500).json({ erro: 'Erro no servidor.' });
        }

        console.log('Escola cadastrada com sucesso');
        res.status(201).json({ sucesso: 'Escola cadastrada com sucesso!' });
    });
});

// GET: Listar apenas escolas do usuário logado
router.get('/listSchool', autenticarToken, (req, res) => {
    const id_usuario = req.usuario.id_usuario;

    const sql = 'SELECT nome_escola, rua_endereco, fone FROM escola WHERE id_usuario = ?';
    db.query(sql, [id_usuario], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ erro: 'Erro ao buscar escolas.' });
        }

        res.json(results);
    });
});

module.exports = router;
