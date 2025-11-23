// models/stockModel.js
const db = require("../config/db");

// ----------------------------------------------------
// 📌 BUSCAR TODAS AS MOVIMENTAÇÕES DE ESTOQUE
// ----------------------------------------------------
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
      p.unit,
      p.current_quantity,
      p.minimum_quantity,

      
      CASE 
        WHEN p.current_quantity < 15 THEN 1
        ELSE 0
      END AS low_stock,

      
      CASE 
        WHEN s.validity <= CURDATE() THEN 1
        WHEN s.validity <= DATE_ADD(CURDATE(), INTERVAL 3 DAY) THEN 1
        ELSE 0
      END AS near_expiration

    FROM stock s
    JOIN product p ON s.id_product = p.id_product
    ORDER BY p.product_name ASC, s.date_movement DESC
  `;

  const [results] = await db.execute(query);
  return results;
}

// ----------------------------------------------------
// 📌 ADICIONAR MOVIMENTAÇÃO DE ESTOQUE
// ----------------------------------------------------
async function addStock(data) {
  const { 
    productName,
    productQuantity,
    productUnit,
    batch,
    validity,
    destination,
    price,
    origin
  } = data;

  if (!productName || !productQuantity || !productUnit) {
    return { error: "Dados obrigatórios não informados." };
  }

  // Verifica se o produto já existe
  const [product] = await db.execute(
    "SELECT id_product FROM product WHERE product_name = ?",
    [productName]
  );

  // ----------------------------------------------
  // 🔹 CASO 1: Produto já existe → só atualiza
  // ----------------------------------------------
  if (product.length > 0) {
    const productId = product[0].id_product;

    await db.execute(
      "UPDATE product SET current_quantity = current_quantity + ? WHERE id_product = ?",
      [productQuantity, productId]
    );

    await db.execute(
      `
      INSERT INTO stock 
      (id_product, quantity_movement, date_movement, batch, validity, destination, origin, price) 
      VALUES (?, ?, NOW(), ?, ?, ?, ?, ?)
      `,
      [productId, productQuantity, batch, validity, destination, origin, price]
    );

    return { message: "Produto atualizado com sucesso" };
  }

  // ----------------------------------------------
  // 🔹 CASO 2: Produto novo → cadastrar
  // ----------------------------------------------
  const [insert] = await db.execute(
    `
    INSERT INTO product 
    (product_name, current_quantity, unit, minimum_quantity)
    VALUES (?, ?, ?, 0)
    `,
    [productName, productQuantity, productUnit]
  );

  const newProductId = insert.insertId;

  await db.execute(
    `
    INSERT INTO stock
    (id_product, quantity_movement, date_movement, batch, validity, destination, origin, price)
    VALUES (?, ?, NOW(), ?, ?, ?, ?, ?)
    `,
    [newProductId, productQuantity, batch, validity, destination, origin, price]
  );

  return { message: "Produto adicionado com sucesso" };
}

async function deleteStockById(id) {
  const [result] = await db.execute(
    "DELETE FROM stock WHERE id_stock = ?",
    [id]
  );
  return result;
}

module.exports = {
  getAllStock,
  addStock,
  deleteStockById
};
