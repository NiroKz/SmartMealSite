// controllers/productionController.js
const { insertProduction, fetchProductionByDate } = require("../models/productionModel");
const db = require("../config/db");

// Função para obter data atual do servidor (YYYY-MM-DD)
function getCurrentDateFormatted() {
  const now = new Date();
  return now.toISOString().split("T")[0];
}

// Helper: busca o nome do produto (product_name) dado o id_product
async function getProductName(id_product) {
  const [results] = await db.execute(
    "SELECT product_name FROM product WHERE id_product = ?",
    [id_product]
  );
  return results.length > 0 ? results[0].product_name : null;
}

// Registrar produção
const registerProduction = async (req, res) => {
  try {
    const { items, mealType, shift, notes } = req.body;

    if (!items || items.length === 0 || !mealType || !shift) {
      return res.status(400).json({ message: "Campos obrigatórios ausentes." });
    }

    for (const item of items) {
      const productName = (await getProductName(item.id_product)) || "";

      const productionData = {
        id_product: item.id_product,
        food: productName,
        quantityProduced: item.quantityProduced,
        mealType,
        shift,
        leftovers: item.leftovers,
        notes: notes || "",
      };

      await insertProduction(productionData);
    }

    res.status(201).json({ message: "Produção registrada com sucesso." });
  } catch (err) {
    console.error("Erro em registerProduction:", err);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

// Consultar produção por data
const getProductionByDate = async (req, res) => {
  try {
    const date = req.query.date || getCurrentDateFormatted();
    const production = await fetchProductionByDate(date);
    res.status(200).json(production);
  } catch (err) {
    console.error("Erro em getProductionByDate:", err);
    res.status(500).json({ message: "Erro ao buscar produção." });
  }
};

// Consultar produção por turno do dia
const getProductionSummaryByShift = async (req, res) => {
  try {
    const date = req.query.date || getCurrentDateFormatted();

    const [results] = await db.execute(
      `SELECT shift, 
              SUM(quantity_produced) AS total_produced, 
              SUM(remnant) AS total_remnant
       FROM production
       WHERE date_production = ?
       GROUP BY shift`,
      [date]
    );

    res.json(results);
  } catch (err) {
    console.error("Erro em getProductionSummaryByShift:", err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

module.exports = {
  registerProduction,
  getProductionByDate,
  getProductionSummaryByShift,
};
