const express = require("express");
const router = express.Router();
const { fetchAllProducts } = require("../controllers/productController");

// Buscar todos os produtos
router.get("/", fetchAllProducts);

module.exports = router;
