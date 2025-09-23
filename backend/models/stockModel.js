const db = require("../config/db");

// Buscar todas as movimentações de estoque
async function getAllStock() {
  const query = `
    SELECT 
      s.id_stock,
      s.batch,
      DATE_FORMAT(s.date_movement, '%d/%m/%Y') AS date_movement,
      s.quantity_movement,
      DATE_FORMAT(s.validity, '%d/%m/%Y') AS validity,
      s.destination,
      p.product_name,
      p.unit
    FROM stock s
    JOIN product p ON s.id_product = p.id_product
    ORDER BY s.date_movement DESC
  `;

  const [results] = await db.execute(query);
  return results;
}

// Inserir nova movimentação de estoque
async function addStock(data) {
  const { id_product, quantity_movement, date_movement, validity, batch, destination } = data;

  const insertQuery = `
    INSERT INTO stock (id_product, quantity_movement, date_movement, validity, batch, destination) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const [result] = await db.execute(insertQuery, [
    id_product,
    quantity_movement,
    date_movement,
    validity,
    batch,
    destination,
  ]);

  // Atualiza quantidade do produto
  const updateQuery = `
    UPDATE product 
    SET current_quantity = current_quantity + ? 
    WHERE id_product = ?
  `;
  await db.execute(updateQuery, [quantity_movement, id_product]);

  return result.insertId;
}

module.exports = {
  getAllStock,
  addStock,
};
