// models/productionModel.js
const db = require("../config/db");

// Inserir produção (agora recebendo também 'food' — nome da comida)
const insertProduction = (productionData) => {
  return new Promise((resolve, reject) => {
    const {
      id_meal, // id da refeição (criado/pego pelo controller)
      id_product, // id do produto (FK para tabela product)
      food, // NOME do produto (campo que causava o erro)
      quantityProduced,
      mealType,
      shift,
      leftovers,
      notes,
    } = productionData;

    // Inserimos explicitamente o campo 'food' no INSERT para evitar o erro
    db.execute(
      `INSERT INTO production
       (id_meal, date_production, id_product, food, quantity_produced, meal_type, shift, remnant, note)
       VALUES (?, CURDATE(), ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_meal,
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

// Buscar produção por data (sem alterações)
const fetchProductionByDate = (date) => {
  return new Promise((resolve, reject) => {
    db.execute(
      `SELECT 
         p.id_product,
         COALESCE(p.food, pr.product_name) AS product_name,
         p.food,
         p.quantity_produced,
         p.remnant,
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
