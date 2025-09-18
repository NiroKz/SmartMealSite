const express = require('express');
const router = express.Router();
const { registerProduction, getProductionByDate, getProductionSummaryByShift } = require('../controllers/productionController');

router.post('/', registerProduction);

router.get('/', getProductionByDate);

// Nova rota para resumo por shift
router.get("/summary", getProductionSummaryByShift);

module.exports = router;
