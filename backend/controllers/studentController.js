const db = require("../config/db");

// Cadastro de aluno
exports.registerStudent = (req, res) => {
  const { nome, RM, Course, student_legal_guardian, food_restriction } = req.body;

  if (!nome || !RM || !Course || !student_legal_guardian) {
    return res.status(400).send("Todos os campos obrigatórios devem ser preenchidos.");
  }

  // 1️⃣ Primeiro pega a id_class pelo course (por simplicidade, pegando a primeira turma encontrada)
  const classQuery = `SELECT id_class FROM class WHERE course = ? LIMIT 1`;
  db.query(classQuery, [Course], (err, classResult) => {
    if (err) return res.status(500).send("Erro ao buscar turma.");

    if (classResult.length === 0) return res.status(400).send("Curso não encontrado.");

    const id_class = classResult[0].id_class;

    // 2️⃣ Insere o aluno na tabela student
    const insertQuery = `
      INSERT INTO student (id_rm, id_class, student_name, student_legal_guardian, food_restriction)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(insertQuery, [RM, id_class, nome, student_legal_guardian, food_restriction], (err, result) => {
      if (err) {
        console.error("Erro ao cadastrar aluno:", err);
        return res.status(500).send("Erro ao cadastrar aluno.");
      }
      res.send("Aluno cadastrado com sucesso!");
    });
  });
};

// Retorna cursos do banco
exports.getCourses = (req, res) => {
  const query = "SELECT DISTINCT course FROM class ORDER BY course;";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Erro ao buscar cursos:", err);
      return res.status(500).json({ error: "Erro ao buscar cursos." });
    }
    res.json(results);
  });
};
