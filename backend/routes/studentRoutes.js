const express = require("express");
const router = express.Router();
const { registerStudent, getClasses } = require("../controllers/studentController");

// Registrar aluno
router.post("/register", registerStudent);

// Buscar turmas completas
router.get("/classes", getClasses);

module.exports = router;
