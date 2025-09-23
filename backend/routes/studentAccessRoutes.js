const express = require("express");
const router = express.Router();
const { getTodayStudentAccessData } = require("../controllers/studentAccessController");

// Dados de acesso dos alunos hoje
router.get("/today", getTodayStudentAccessData);

module.exports = router;
