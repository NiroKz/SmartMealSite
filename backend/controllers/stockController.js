// controllers/stockController.js
const stockModel = require("../models/stockModel");

// Buscar todas as movimentações de estoque
exports.getStock = async (req, res) => {
  try {
    const stock = await stockModel.getAllStock();
    res.json(stock);
  } catch (err) {
    console.error("Erro ao buscar estoque:", err);
    res.status(500).json({ error: "Erro ao buscar estoque" });
  }
};

// Adicionar movimentação de estoque
exports.addStock = async (req, res) => {
  try {
    const result = await stockModel.addStock(req.body);
    res.status(200).json(result);
  } catch (err) {
    console.error("Erro ao adicionar produto:", err);
    res.status(500).json({ error: "Erro no servidor" });
  }
};
