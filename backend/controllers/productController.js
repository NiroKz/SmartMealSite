const db = require("../config/db");

// Buscar todos os produtos
const fetchAllProducts = async (req, res) => {
  try {
    const [results] = await db.query("SELECT id_product, product_name FROM product");
    return res.json(results);
  } catch (err) {
    console.error("Erro ao buscar produtos:", err);
    return res.status(500).json({ message: "Erro ao buscar produtos." });
  }
};

module.exports = { fetchAllProducts };
