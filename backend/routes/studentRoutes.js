const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");

// Cadastro de aluno
router.post("/register", studentController.registerStudent);

// Buscar turmas completas
router.get("/classes", studentController.getClasses);

module.exports = router;
