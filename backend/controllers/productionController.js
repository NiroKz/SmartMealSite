// controllers/productionController.js
const {
  insertProduction,
  fetchProductionByDate,
} = require("../models/productionModel");
const db = require("../config/db");

// Função para obter data atual do servidor (YYYY-MM-DD)
function getCurrentDateFormatted() {
  const now = new Date();
  return now.toISOString().split("T")[0];
}

// Helper: busca o nome do produto
async function getProductName(id_product) {
  const [results] = await db.execute(
    "SELECT product_name FROM product WHERE id_product = ?",
    [id_product]
  );
  return results.length > 0 ? results[0].product_name : null;
}

// 🔥 REGISTRAR PRODUÇÃO + BAIXAR ESTOQUE AUTOMATICAMENTE
const registerProduction = async (req, res) => {
  let connection;

  try {
    const { items, mealType, shift, notes } = req.body;

    if (!items || items.length === 0 || !mealType || !shift) {
      return res.status(400).json({ message: "Campos obrigatórios ausentes." });
    }

    // Criar conexão exclusiva para transação
    connection = await db.getConnection();

    await connection.beginTransaction();

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

      // 1) Inserir produção
      await connection.execute(
        `
        INSERT INTO production
        (date_production, id_product, food, quantity_produced, meal_type, shift, remnant, note)
        VALUES (CURDATE(), ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          productionData.id_product,
          productionData.food,
          productionData.quantityProduced,
          productionData.mealType,
          productionData.shift,
          productionData.leftovers,
          productionData.notes,
        ]
      );

      console.log("🔎 DEBUG:", {
        id_product: item.id_product,
        quantityProduced: item.quantityProduced,
      });

      // 2) Baixa do estoque na tabela product
      await connection.execute(
        `
  UPDATE stock
  SET quantity_movement = quantity_movement - ?
  WHERE id_product = ?;
  `,
        [item.quantityProduced, item.id_product]
      );
    }

    await connection.commit();

    // Liberar conexão
    connection.release();

    res.status(201).json({
      message: "Produção registrada e estoque atualizado com sucesso.",
    });
  } catch (err) {
    console.error("❌ Erro em registerProduction:", err);

    if (connection) {
      await connection.rollback();
      connection.release();
    }

    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

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
