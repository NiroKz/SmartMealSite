// controllers/classController.js

const ClassModel = require("../models/classModel");

// Controller que recebe os dados e envia para o Model
async function registerClass(req, res) {
  try {
    const { course, period, grade, date_registration } = req.body;

    // Validação básica
    if (!course || !period || !grade || !date_registration) {
      return res.status(400).json({ message: "Preencha todos os campos!" });
    }

    // Envia para o Model fazer o INSERT
    await ClassModel.createClass(course, period, grade, date_registration);

    res.status(201).json({ message: "Turma cadastrada com sucesso!" });

  } catch (error) {
    console.error("Erro ao criar turma:", error);
    res.status(500).json({ message: "Erro no servidor." });
  }
}

module.exports = {
  registerClass
};
