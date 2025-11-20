// routes/classRoutes.js

const express = require("express");
const router = express.Router();
const ClassController = require("../controllers/classController");

// Rota POST para cadastrar turmas
router.post("/register", ClassController.registerClass);

module.exports = router;
