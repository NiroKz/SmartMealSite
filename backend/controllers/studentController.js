// controllers/studentController.js
const db = require("../config/db");

// -----------------------------------------------------
//  CADASTRAR ALUNO
// -----------------------------------------------------
exports.registerStudent = async (req, res) => {
  try {
    const { nome, RM, id_class, student_legal_guardian, food_restriction } =
      req.body;

    const insertQuery = `
      INSERT INTO student (id_rm, id_class, student_name, student_legal_guardian, food_restriction)
      VALUES (?, ?, ?, ?, ?)
    `;

    await db.execute(insertQuery, [
      RM,
      id_class,
      nome,
      student_legal_guardian,
      food_restriction || null,
    ]);

    res.status(201).json({ message: "Aluno cadastrado com sucesso!" });
  } catch (err) {
    console.error("Erro ao cadastrar aluno:", err);
    res.status(500).json({ error: "Erro ao cadastrar aluno." });
  }
};

// -----------------------------------------------------
//  LISTAR TURMAS
// -----------------------------------------------------
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

// -----------------------------------------------------
//  BUSCAR ALUNOS
// -----------------------------------------------------
exports.searchStudents = async (req, res) => {
  const { query } = req.query;

  try {
    const sql = `
      SELECT 
        s.id_rm AS id_student,
        s.id_rm,
        s.student_name,
        s.student_legal_guardian,
        s.food_restriction,
        c.course,
        c.grade,
        c.period
      FROM student s
      JOIN class c ON c.id_class = s.id_class
      WHERE s.id_rm LIKE ? OR s.student_name LIKE ?
      ORDER BY s.student_name
    `;

    const [rows] = await db.execute(sql, [`%${query}%`, `%${query}%`]);

    res.json(rows);
  } catch (err) {
    console.error("Erro ao buscar alunos:", err);
    res.status(500).json({ error: "Erro interno" });
  }
};

// -----------------------------------------------------
//  ATUALIZAR ALUNO
// -----------------------------------------------------
exports.updateStudent = async (req, res) => {
  try {
    const { id_student } = req.params;

    const { nome, RM, student_legal_guardian, food_restriction } = req.body;

    // 1️⃣ Buscar o id_class atual
    const [oldData] = await db.execute(
      "SELECT id_class FROM student WHERE id_rm = ?",
      [id_student]
    );

    if (oldData.length === 0) {
      return res.status(404).json({ error: "Aluno não encontrado" });
    }

    const id_class = oldData[0].id_class; // mantém a turma atual

    // 2️⃣ Atualizar
    const sql = `
      UPDATE student
      SET id_rm = ?, id_class = ?, student_name = ?, student_legal_guardian = ?, food_restriction = ?
      WHERE id_rm = ?
    `;

    await db.execute(sql, [
      RM,
      id_class,
      nome,
      student_legal_guardian,
      food_restriction || null,
      id_student,
    ]);

    res.json({ message: "Aluno atualizado com sucesso!" });
  } catch (err) {
    console.error("Erro ao atualizar aluno:", err);
    res.status(500).json({ error: "Erro ao atualizar aluno." });
  }
};

// -----------------------------------------------------
//  EXCLUIR ALUNO
// -----------------------------------------------------
exports.deleteStudent = async (req, res) => {
  try {
    const { id_student } = req.params; // ESTE É O id_rm

    const sql = `DELETE FROM student WHERE id_rm = ?`;

    await db.execute(sql, [id_student]);

    res.json({ message: "Aluno excluído com sucesso!" });
  } catch (err) {
    console.error("Erro ao excluir aluno:", err);
    res.status(500).json({ error: "Erro ao excluir aluno." });
  }
};
