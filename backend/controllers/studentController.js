const db = require("../config/db");

// Cadastro de aluno
exports.registerStudent = (req, res) => {
  const { nome, RM, id_class, student_legal_guardian, food_restriction } = req.body;

  if (!nome || !RM || !id_class || !student_legal_guardian) {
    return res.status(400).send("Todos os campos obrigatórios devem ser preenchidos.");
  }

  const insertQuery = `
    INSERT INTO student (id_rm, id_class, student_name, student_legal_guardian, food_restriction)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(insertQuery, [RM, id_class, nome, student_legal_guardian, food_restriction], (err, result) => {
    if (err) {
      console.error("Erro ao cadastrar aluno:", err);
      return res.status(500).send("Erro ao cadastrar aluno.");
    }
    res.json(results);
    //res.send("Aluno cadastrado com sucesso!");
    res.status(201).send("Aluno cadastrado com sucesso!");
  });
};

// Retorna todas as turmas (curso, ano, período e id_class)
exports.getClasses = (req, res) => {
  const query = "SELECT id_class, course, grade, period FROM class ORDER BY course, grade, period";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Erro ao buscar turmas:", err);
      return res.status(500).json({ error: "Erro ao buscar turmas." });
    }
    res.json(results);
  });
};
