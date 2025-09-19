// models/productionModel.js
const db = require("../config/db");

// Inserir produção (recebe também 'food')
const insertProduction = (productionData) => {
  return new Promise((resolve, reject) => {
    const {
      id_product,    // id do produto (FK)
      food,          // nome do produto
      quantityProduced,
      mealType,
      shift,
      leftovers,
      notes,
    } = productionData;

    db.execute(
      `INSERT INTO production
       (date_production, id_product, food, quantity_produced, meal_type, shift, remnant, note)
       VALUES (CURDATE(), ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_product,
        food,
        quantityProduced,
        mealType,
        shift,
        leftovers,
        notes,
      ],
      (err, result) => {
        if (err) return reject(err);
        resolve(result);
      }
    );
  });
};

// Buscar produção por data (já normalizando nomes para o front)
const fetchProductionByDate = (date) => {
  return new Promise((resolve, reject) => {
    db.execute(
      `SELECT 
         p.id_product,
         COALESCE(p.food, pr.product_name) AS product_name,
         p.food,
         p.quantity_produced AS produced,  
         p.remnant AS remnant,             
         p.meal_type,
         p.shift,
         p.note
       FROM production p
       LEFT JOIN product pr ON pr.id_product = p.id_product
       WHERE p.date_production = ?`,
      [date],
      (err, results) => {
        if (err) return reject(err);
        else resolve(results);
      }
    );
  });
};

module.exports = { insertProduction, fetchProductionByDate };
