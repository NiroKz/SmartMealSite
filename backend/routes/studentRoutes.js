const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");

// Rota para cadastrar aluno
router.post("/register", studentController.registerStudent);

// Rota para buscar cursos dinamicamente
router.get("/courses", studentController.getCourses);

module.exports = router;
