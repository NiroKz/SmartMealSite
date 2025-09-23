// controllers/stockController.js
const db = require("../config/db");

// Buscar todas as movimentações de estoque
exports.getStock = async (req, res) => {
  try {
    const [stock] = await db.execute("SELECT * FROM stock ORDER BY date_movement DESC");
    res.json(stock);
  } catch (err) {
    console.error("Erro ao buscar estoque:", err);
    res.status(500).json({ error: "Erro ao buscar estoque" });
  }
};

// Adicionar movimentação de estoque
exports.addStock = async (req, res) => {
  const { productName, productQuantity, productUnit, batch, validity, destination } = req.body;

  try {
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
        "INSERT INTO stock (id_product, quantity_movement, date_movement, batch, validity, destination) VALUES (?, ?, NOW(), ?, ?, ?)",
        [product[0].id_product, productQuantity, batch, validity, destination]
      );

      return res.status(200).json({ message: "Produto atualizado com sucesso" });
    } else {
      // Produto novo → cadastra
      const [insert] = await db.execute(
        "INSERT INTO product (product_name, current_quantity, unit, minimum_quantity) VALUES (?, ?, ?, 0)",
        [productName, productQuantity, productUnit]
      );

      await db.execute(
        "INSERT INTO stock (id_product, quantity_movement, date_movement, batch, validity, destination) VALUES (?, ?, NOW(), ?, ?, ?)",
        [insert.insertId, productQuantity, batch, validity, destination]
      );

      return res.status(200).json({ message: "Produto adicionado com sucesso" });
    }
  } catch (err) {
    console.error("Erro ao adicionar produto:", err);
    res.status(500).json({ error: "Erro no servidor" });
  }
};
