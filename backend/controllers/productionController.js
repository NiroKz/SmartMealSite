const { insertProduction, fetchProductionByDate } = require("../models/productionModel");
const db = require("../config/db");

// Função para obter data atual do servidor (YYYY-MM-DD)
function getCurrentDateFormatted() {
  const now = new Date();
  return now.toISOString().split("T")[0];
}

// Função para criar ou obter id_meal do dia
async function getOrCreateMeal(mealType, shift) {
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
}

// Registrar produção
const registerProduction = async (req, res) => {
  try {
    const { items, mealType, shift, notes } = req.body;

    if (!items || items.length === 0 || !mealType || !shift) {
      return res.status(400).json({ message: "Campos obrigatórios ausentes." });
    }

    const id_meal = await getOrCreateMeal(mealType, shift);

    for (const item of items) {
      const productionData = {
        id_meal,
        id_product: item.id_product,
        quantityProduced: item.quantityProduced,
        mealType,
        shift,
        leftovers: item.leftovers,
        notes: notes || ""
      };
      await insertProduction(productionData);
    }

    res.status(201).json({ message: "Produção registrada com sucesso." });
  } catch (err) {
    console.error(err);
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
    console.error(err);
    res.status(500).json({ message: "Erro ao buscar produção." });
  }
};

module.exports = { registerProduction, getProductionByDate };
