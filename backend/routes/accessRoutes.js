// routes/accessRoutes.js
const express = require("express");
const router = express.Router();
const accessController = require("../controllers/accessController");

// 🔹 Rota para listar todos os acessos
router.get("/access", accessController.getAllAccess);

// 🔹 Rota para buscar permissões de um usuário específico
router.get("/access/:id_user", accessController.getAccessByUser);

// 🔹 Rota para atualizar permissões de um usuário
router.put("/access/:id_user", accessController.updateAccess);

module.exports = router;
