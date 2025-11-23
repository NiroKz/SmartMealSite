// routes/stockRoutes.js
const express = require("express");
const router = express.Router();
const stockController = require("../controllers/stockController");

// Rota para buscar estoque
router.get("/", stockController.getStock);

// Rota para adicionar estoque (POST /stock)
router.post("/", stockController.registerStock);

// Rota para deletar movimentação de estoque (DELETE /stock/:id)
router.delete("/:id", stockController.deleteStock);

module.exports = router;
