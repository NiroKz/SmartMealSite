const db = require("../config/db");

// Inserir produção
const insertProduction = async (productionData) => {
  const {
    id_product,
    food,
    quantityProduced,
    mealType,
    shift,
    leftovers,
    notes,
  } = productionData;

  const query = `
    INSERT INTO production
    (date_production, id_product, food, quantity_produced, meal_type, shift, remnant, note)
    VALUES (CURDATE(), ?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await db.execute(query, [
    id_product,
    food,
    quantityProduced,
    mealType,
    shift,
    leftovers,
    notes,
  ]);

  return result;
};

// Buscar produção por data
const fetchProductionByDate = async (date) => {
  const query = `
    SELECT 
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
    WHERE p.date_production = ?
  `;

  const [results] = await db.execute(query, [date]);
  return results;
};

module.exports = { insertProduction, fetchProductionByDate };
