// controllers/stockController.js
const stockModel = require("../models/stockModel");

// Retorna todos os registros de estoque
exports.getStock = (req, res) => {
  stockModel.getAllStock((err, stock) => {
    if (err) {
      console.error("Erro ao buscar estoque:", err);
      return res.status(500).json({ error: "Erro ao buscar estoque" });
    }
    res.json(stock);
  });
};

// Adiciona um movimento no estoque
exports.addStock = (req, res) => {
  const { id_product, quantity_movement, date_movement, validity, batch, destination } = req.body;

  if (!id_product || !quantity_movement || !date_movement || !validity || !batch || !destination) {
    return res.status(400).json({ error: "Preencha todos os campos" });
  }

  stockModel.addStock(
    { id_product, quantity_movement, date_movement, validity, batch, destination },
    (err, newStockId) => {
      if (err) {
        console.error("Erro ao adicionar estoque:", err);
        return res.status(500).json({ error: "Erro ao adicionar estoque" });
      }
      res.status(201).json({ message: "Movimento de estoque adicionado!", id: newStockId });
    }
  );
};
