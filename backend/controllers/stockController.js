// controllers/stockController.js
const stockModel = require("../models/stockModel");

// Buscar todas as movimentações de estoque
async function getStock(req, res) {
  try {
    const stocks = await stockModel.getAllStock();
    return res.status(200).json(stocks);
  } catch (err) {
    console.error("Erro ao buscar estoque:", err);
    return res.status(500).json({ error: "Erro ao buscar estoque." });
  }
}

// Inserir movimentação de estoque
async function registerStock(req, res) {
  try {
    const data = req.body;

    // Renomear para ficar compatível com o model
    const mappedData = {
      productName: data.name,
      productQuantity: data.quantity,
      productUnit: data.unit,
      batch: data.batch,
      validity: data.validity,
      destination: data.destination,
      origin: data.origin,
      price: data.price
    };

    // Verifica quantidade válida
    if (!mappedData.productQuantity || isNaN(mappedData.productQuantity)) {
      return res.status(400).json({ error: "Quantidade inválida." });
    }

    const result = await stockModel.addStock(mappedData);

    if (result.error) {
      return res.status(400).json(result);
    }

    return res.status(201).json(result);

  } catch (err) {
    console.error("Erro ao registrar movimentação:", err);
    return res.status(500).json({ error: "Erro ao registrar movimentação." });
  }
}

async function deleteStock(req, res) {
  try {
    const { id } = req.params;

    const result = await stockModel.deleteStockById(id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Registro não encontrado." });
    }

    return res.status(200).json({ message: "Registro excluído com sucesso." });
  } catch (err) {
    console.error("Erro ao excluir:", err);
    return res.status(500).json({ error: "Erro ao excluir registro." });
  }
}


module.exports = {
  getStock,
  registerStock,
  deleteStock
};