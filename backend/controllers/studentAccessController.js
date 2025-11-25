// controllers/studentAccessController.js
const { fetchStudentAccessDataToday, fetchStudentAccessMonth } = require("../models/studentAccessModel");
const { generate } = require("@pdfme/generator");
const { BLANK_PDF } = require("@pdfme/common");

// Retorna os dados do dia para o front-end
const getTodayStudentAccessData = async (req, res) => {
  try {
    const data = await fetchStudentAccessDataToday();
    res.json(data);
  } catch (error) {
    console.error("Erro em getTodayStudentAccessData:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
};

const getStudentAccessMonth = async (req, res) => {
  try {
    const { year, month } = req.query;

    if (!year || !month) {
      return res.status(400).json({
        error: "É necessário enviar year e month. Ex: /month?year=2025&month=11",
      });
    }

    const data = await fetchStudentAccessMonth(year, month);
    res.json(data);
  } catch (error) {
    console.error("Erro em getStudentAccessMonth:", error);
    res.status(500).json({ error: "Erro ao buscar dados do mês." });
  }
};


module.exports = {
  getTodayStudentAccessData,
  getStudentAccessMonth,
};