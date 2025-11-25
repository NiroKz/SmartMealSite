const express = require("express");
const router = express.Router();
const {
  getTodayStudentAccessData,
  getStudentAccessMonth,
} = require("../controllers/studentAccessController");

// Dados de acesso dos alunos hoje
router.get("/today", getTodayStudentAccessData);
router.get("/month", getStudentAccessMonth);


module.exports = router;
