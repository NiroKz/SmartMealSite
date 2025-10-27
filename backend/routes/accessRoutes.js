// routes/accessRoutes.js
const express = require("express");
const router = express.Router();
const accessController = require("../controllers/accessController");

// 🔹 Rota para listar todos os acessos
router.get("/access", accessController.getAllAccess);

// 🔹 Rota para atualizar permissões de um usuário
router.put("/access/:id_user", accessController.updateAccess);

module.exports = router;
