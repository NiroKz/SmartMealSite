const express = require("express");
const router = express.Router();
const {
  getTodayStudentAccessData,
  generateStudentAccessReport,
} = require("../controllers/studentAccessController");

// Dados de acesso dos alunos hoje
router.get("/today", getTodayStudentAccessData);

// Geração do relatório em PDF
router.get("/report", generateStudentAccessReport);

module.exports = router;
