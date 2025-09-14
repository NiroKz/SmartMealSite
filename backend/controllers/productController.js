// controllers/productController.js
const db = require("../config/db");

// Função para buscar todos os produtos
const fetchAllProducts = (req, res) => {
  db.execute("SELECT id_product, product_name FROM product", (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Erro ao buscar produtos." });
    }
    res.json(results);
  });
};

module.exports = { fetchAllProducts };
