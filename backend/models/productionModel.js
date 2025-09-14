const db = require("../config/db");

// Inserir produção
const insertProduction = (productionData) => {
  return new Promise((resolve, reject) => {
    const {
      id_meal,      // agora obrigatório
      id_product,
      quantityProduced,
      mealType,
      shift,
      leftovers,
      notes
    } = productionData;

    db.execute(
      `INSERT INTO production
       (id_meal, date_production, id_product, quantity_produced, meal_type, shift, remnant, note)
       VALUES (?, CURDATE(), ?, ?, ?, ?, ?, ?)`,
      [id_meal, id_product, quantityProduced, mealType, shift, leftovers, notes],
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
};

// Buscar produção por data
const fetchProductionByDate = (date) => {
  return new Promise((resolve, reject) => {
    db.execute(
      `SELECT p.id_product, pr.product_name, p.quantity_produced, p.remnant, p.meal_type, p.shift, p.note
       FROM production p
       JOIN product pr ON pr.id_product = p.id_product
       WHERE p.date_production = ?`,
      [date],
      (err, results) => {
        if (err) reject(err);
        else resolve(results);
      }
    );
  });
};

module.exports = { insertProduction, fetchProductionByDate };
