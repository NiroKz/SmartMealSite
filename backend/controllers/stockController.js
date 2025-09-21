const stockModel = require("../models/stockModel");
const db = require("../config/db");

// Buscar todas as movimentações de estoque
exports.getStock = (req, res) => {
  stockModel.getAllStock((err, stock) => {
    if (err) {
      console.error("Erro ao buscar estoque:", err);
      return res.status(500).json({ error: "Erro ao buscar estoque" });
    }
    res.json(stock);
  });
};

// Adicionar movimentação de estoque
exports.addStock = async (req, res) => {
  const {
    productName,
    productQuantity,
    productUnit,
    batch,
    validity,
    destination,
  } = req.body;

  try {
    // 1. Verifica se produto já existe
    db.query(
      "SELECT id_product FROM product WHERE product_name = ?",
      [productName],
      (err, product) => {
        if (err) return res.status(500).json({ error: "Erro no servidor" });

        if (product.length > 0) {
          // Produto já existe → atualiza quantidade
          db.query(
            "UPDATE product SET current_quantity = current_quantity + ? WHERE id_product = ?",
            [productQuantity, product[0].id_product],
            (err) => {
              if (err)
                return res.status(500).json({ error: "Erro no servidor" });

              // Registra no histórico (stock)
              db.query(
                "INSERT INTO stock (id_product, quantity_movement, date_movement, batch, validity, destination) VALUES (?, ?, NOW(), ?, ?, ?)",
                [
                  product[0].id_product,
                  productQuantity,
                  batch,
                  validity,
                  destination,
                ],
                (err) => {
                  if (err)
                    return res.status(500).json({ error: "Erro no servidor" });
                  res
                    .status(200)
                    .json({ message: "Produto atualizado com sucesso" });
                }
              );
            }
          );
        } else {
          // Produto novo → cadastra
          db.query(
            "INSERT INTO product (product_name, current_quantity, unit, minimum_quantity) VALUES (?, ?, ?, 0)",
            [productName, productQuantity, productUnit],
            (err, insert) => {
              if (err)
                return res.status(500).json({ error: "Erro no servidor" });

              // Registra no histórico
              db.query(
                "INSERT INTO stock (id_product, quantity_movement, date_movement, batch, validity, destination) VALUES (?, ?, NOW(), ?, ?, ?)",
                [
                  insert.insertId,
                  productQuantity,
                  batch,
                  validity,
                  destination,
                ],
                (err) => {
                  if (err)
                    return res.status(500).json({ error: "Erro no servidor" });
                  res
                    .status(200)
                    .json({ message: "Produto adicionado com sucesso" });
                }
              );
            }
          );
        }
      }
    );
  } catch (err) {
    console.error("Erro ao adicionar produto:", err);
    res.status(500).json({ error: "Erro no servidor" });
  }
};
