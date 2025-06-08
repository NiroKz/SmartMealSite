const express = require('express');
const router = express.Router();
const graficoController = require('../controllers/graficoController');

router.get('/alunos-por-curso', graficoController.alunosPorCurso);

module.exports = router;
