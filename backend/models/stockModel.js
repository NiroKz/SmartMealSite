// models/stockModel.js
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
      s.price,
      s.origin,
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
  const { productName, productQuantity, productUnit, batch, validity, destination, price, origin } = data;

  // Verifica se o produto já existe
  const [product] = await db.execute(
    "SELECT id_product FROM product WHERE product_name = ?",
    [productName]
  );

  if (product.length > 0) {
    // Produto já existe → atualiza quantidade
    await db.execute(
      "UPDATE product SET current_quantity = current_quantity + ? WHERE id_product = ?",
      [productQuantity, product[0].id_product]
    );

    await db.execute(
      "INSERT INTO stock (id_product, quantity_movement, date_movement, batch, validity, destination, origin, price) VALUES (?, ?, NOW(), ?, ?, ?, ?, ?)",
      [product[0].id_product, productQuantity, batch, validity, destination, origin, price]
    );

    return { message: "Produto atualizado com sucesso" };
  } else {
    // Produto novo → cadastra
    const [insert] = await db.execute(
      "INSERT INTO product (product_name, current_quantity, unit, minimum_quantity) VALUES (?, ?, ?, 0)",
      [productName, productQuantity, productUnit]
    );

    await db.execute(
      "INSERT INTO stock (id_product, quantity_movement, date_movement, batch, validity, destination, origin, price) VALUES (?, ?, NOW(), ?, ?, ?, ?, ?)",
      [insert.insertId, productQuantity, batch, validity, destination, price, origin]
    );

    return { message: "Produto adicionado com sucesso" };
  }
}

module.exports = {
  getAllStock,
  addStock,
};
