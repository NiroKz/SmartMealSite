const express = require("express");
const router = express.Router();
const { getTodayStudentAccessData } = require("../controllers/studentAccessController");

router.get("/today", getTodayStudentAccessData);

module.exports = router;