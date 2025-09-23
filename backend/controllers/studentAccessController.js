// controllers/studentAccessController.js
const { fetchStudentAccessDataToday } = require("../models/studentAccessModel");

const getTodayStudentAccessData = async (req, res) => {
  try {
    const data = await fetchStudentAccessDataToday();
    res.json(data);
  } catch (error) {
    console.error("Erro em getTodayStudentAccessData:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

module.exports = {
  getTodayStudentAccessData,
};
