// controllers/productionController.js
const { insertProduction, fetchProductionByDate } = require("../models/productionModel");
const db = require("../config/db");

// Função para obter data atual do servidor (YYYY-MM-DD)
function getCurrentDateFormatted() {
  const now = new Date();
  return now.toISOString().split("T")[0];
}

// Função para criar ou obter id_meal do dia (mantida igual)
/*async function getOrCreateMeal(mealType, shift) {
  const today = getCurrentDateFormatted();

  return new Promise((resolve, reject) => {
    db.execute(
      `SELECT id_meal FROM meal WHERE DATE(date_time) = ? AND type_meal = ?`,
      [today, mealType],
      (err, results) => {
        if (err) return reject(err);

        if (results.length > 0) {
          resolve(results[0].id_meal);
        } else {
          const now = new Date().toISOString().slice(0, 19).replace("T", " ");
          db.execute(
            `INSERT INTO meal (date_time, type_meal, access_status) VALUES (?, ?, ?)`,
            [now, mealType, "allowed"],
            (err2, result) => {
              if (err2) return reject(err2);
              resolve(result.insertId);
            }
          );
        }
      }
    );
  });
}*/

// Helper: busca o nome do produto (product_name) dado o id_product
function getProductName(id_product) {
  return new Promise((resolve, reject) => {
    db.execute(
      'SELECT product_name FROM product WHERE id_product = ?',
      [id_product],
      (err, results) => {
        if (err) return reject(err);
        if (results.length > 0) resolve(results[0].product_name);
        else resolve(null); // retorna null se não encontrar
      }
    );
  });
}

// Registrar produção (agora pega product_name e envia como 'food' ao model)
const registerProduction = async (req, res) => {
  try {
    const { items, mealType, shift, notes } = req.body;

    if (!items || items.length === 0 || !mealType || !shift) {
      return res.status(400).json({ message: "Campos obrigatórios ausentes." });
    }

    // cria ou obtém id_meal para o dia
    // const id_meal = await getOrCreateMeal(mealType, shift);

    // itera cada item e grava na tabela production
    for (const item of items) {
      // pega o nome do produto para salvar em 'food'
      const productName = (await getProductName(item.id_product)) || "";

      const productionData = {
        id_product: item.id_product,
        food: productName, // <- aqui garantimos que 'food' será enviado
        quantityProduced: item.quantityProduced,
        mealType,
        shift,
        leftovers: item.leftovers,
        notes: notes || ""
      };

      // insere a produção
      await insertProduction(productionData);
    }

    res.status(201).json({ message: "Produção registrada com sucesso." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro interno do servidor." });
  }
};

// Consultar produção por data (mantida igual)
const getProductionByDate = async (req, res) => {
  try {
    const date = req.query.date || getCurrentDateFormatted();
    const production = await fetchProductionByDate(date);
    res.status(200).json(production);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao buscar produção." });
  }
};

// Consultar produção por turno (shift) do dia
const getProductionSummaryByShift = async (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().split("T")[0];

    db.execute(
      `SELECT shift, SUM(quantity_produced) AS total_produced, SUM(remnant) AS total_remnant
       FROM production
       WHERE date_production = ?
       GROUP BY shift`,
      [date],
      (err, results) => {
        if (err) return res.status(500).json({ error: "Erro ao buscar produção por turno" });

        res.json(results); // retorna algo como [{shift: "morning", total_produced: 10, total_remnant: 2}, ...]
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

module.exports = { registerProduction, getProductionByDate, getProductionSummaryByShift };
