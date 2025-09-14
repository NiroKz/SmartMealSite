const express = require("express");
const router = express.Router();
const { fetchAllProducts } = require("../controllers/productController"); // só importar

router.get("/", fetchAllProducts); // usar a função importada

module.exports = router;
