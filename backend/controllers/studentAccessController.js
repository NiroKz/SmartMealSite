// controllers/studentAccessController.js
const { fetchStudentAccessDataToday } = require("../models/studentAccessModel");
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

// Gera e envia o PDF direto como download
const generateStudentAccessReport = async (req, res) => {
  try {
    const data = await fetchStudentAccessDataToday();

    // Template do PDF usando PDF em branco
    const template = {
      basePdf: BLANK_PDF,
      schemas: [
        {
          title: {
            type: "text",
            position: { x: 200, y: 40 },
            width: 200,
            height: 30,
            fontSize: 18,
          },
          percentage: {
            type: "text",
            position: { x: 50, y: 90 },
            width: 500,
            height: 20,
            fontSize: 16,
          },
          total: {
            type: "text",
            position: { x: 50, y: 120 },
            width: 500,
            height: 20,
            fontSize: 14,
          },
          lunch: {
            type: "text",
            position: { x: 50, y: 150 },
            width: 500,
            height: 20,
            fontSize: 14,
          },
          dinner: {
            type: "text",
            position: { x: 50, y: 180 },
            width: 500,
            height: 20,
            fontSize: 14,
          },
          date: {
            type: "text",
            position: { x: 50, y: 220 },
            width: 500,
            height: 20,
            fontSize: 12,
          },
        },
      ],
    };

    const percentage =
      data.total_students > 0
        ? Math.round((data.total_today / data.total_students) * 100)
        : 0;

    const inputs = [
      {
        title: "Relatório de Refeições do Dia",
        percentage: `Alunos que comeram hoje: ${percentage}%`,
        total: `Total de alunos: ${data.total_students}`,
        lunch: `Almoços servidos: ${data.lunch_count}`,
        dinner: `Jantas servidas: ${data.dinner_count}`,
        date: `Data: ${new Date().toLocaleDateString("pt-BR")}`,
      },
    ];

    // Gera o PDF direto como buffer
    const pdfBuffer = await generate({ template, inputs });

    // Envia o PDF direto para o navegador
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "attachment; filename=relatorio.pdf");
    res.send(pdfBuffer);
  } catch (error) {
    console.error("Erro ao gerar relatório PDF:", error);
    res.status(500).json({ error: "Erro ao gerar relatório." });
  }
};

module.exports = {
  getTodayStudentAccessData,
  generateStudentAccessReport,
};