// controllers/studentController.js
const db = require("../config/db");

// Cadastro de aluno
exports.registerStudent = async (req, res) => {
  try {
    const { nome, RM, id_class, student_legal_guardian, food_restriction } = req.body;

    if (!nome || !RM || !id_class || !student_legal_guardian) {
      return res.status(400).json({ error: "Todos os campos obrigatórios devem ser preenchidos." });
    }

    const insertQuery = `
      INSERT INTO student (id_rm, id_class, student_name, student_legal_guardian, food_restriction)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(insertQuery, [
      RM,
      id_class,
      nome,
      student_legal_guardian,
      food_restriction || null,
    ]);

    res.status(201).json({
      message: "Aluno cadastrado com sucesso!",
      id_student: result.insertId,
    });
  } catch (err) {
    console.error("Erro ao cadastrar aluno:", err);
    res.status(500).json({ error: "Erro ao cadastrar aluno." });
  }
};

// Retorna todas as turmas
exports.getClasses = async (req, res) => {
  try {
    const [results] = await db.execute(
      "SELECT id_class, course, grade, period FROM class ORDER BY course, grade, period"
    );
    res.json(results);
  } catch (err) {
    console.error("Erro ao buscar turmas:", err);
    res.status(500).json({ error: "Erro ao buscar turmas." });
  }
};
