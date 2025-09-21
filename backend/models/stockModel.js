// models/stockModel.js
const db = require("../config/db");

// Buscar todos os registros de estoque com nome do produto
function getAllStock(callback) {
  db.query(
    `SELECT 
        s.id_stock,
        s.batch,
        DATE_FORMAT(s.date_movement, '%d/%m/%Y') AS date_movement,
        s.quantity_movement,
        DATE_FORMAT(s.validity, '%d/%m/%Y') AS validity,
        p.product_name
     FROM stock s
     JOIN product p ON s.id_product = p.id_product
     ORDER BY s.date_movement DESC`,
    (err, results) => {
      if (err) return callback(err, null);
      callback(null, results);
    }
  );
}

// Adicionar novo movimento de estoque
function addStock(data, callback) {
  const { id_product, quantity_movement, date_movement, validity, batch, destination } = data;

  db.query(
    `INSERT INTO stock (id_product, quantity_movement, date_movement, validity, batch, destination) 
     VALUES (?, ?, ?, ?, ?, ?)`,
    [id_product, quantity_movement, date_movement, validity, batch, destination],
    (err, result) => {
      if (err) return callback(err, null);

      // Atualiza a quantidade do produto
      db.query(
        `UPDATE product SET current_quantity = current_quantity + ? WHERE id_product = ?`,
        [quantity_movement, id_product],
        (err2) => {
          if (err2) return callback(err2, null);
          callback(null, result.insertId);
        }
      );
    }
  );
}

module.exports = {
  getAllStock,
  addStock
};
