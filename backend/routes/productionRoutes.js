const express = require("express");
const router = express.Router();
const { registerProduction, getProductionByDate, getProductionSummaryByShift } = require("../controllers/productionController");

// Criar produção
router.post("/", registerProduction);

// Buscar produção por data
router.get("/", getProductionByDate);

// Resumo de produção por turno
router.get("/summary", getProductionSummaryByShift);

module.exports = router;
