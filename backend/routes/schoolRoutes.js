const express = require('express');
const router = express.Router();
const Escola = require('../models/schoolModel');
const db = require('../config/db');

router.post('/addSchools', (req, res) => {
    const { id_usuario, nome_escola, rua_endereco, fone } = req.body;

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

router.get('/listSchool', (req, res) => {
    const sql = 'SELECT nome_escola, rua_endereco, fone FROM escola';

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ erro: 'Erro ao buscar escolas.' });
        }

        res.json(results);
    });
});


module.exports = router;