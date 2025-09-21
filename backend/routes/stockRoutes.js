// routes/stockRoutes.js
const express = require("express");
const router = express.Router();
const stockController = require("../controllers/stockController");

// Rota para buscar estoque
router.get("/", stockController.getStock);

// Rota para adicionar movimento de estoque
router.post("/", stockController.addStock);

// Rota para adicionar movimento de estoque
router.post("/add", stockController.addStock);


module.exports = router;
