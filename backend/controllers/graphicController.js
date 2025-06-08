const db = require('../config/db');

exports.studentsCurses = (req, res) => {
  const query = `
    SELECT t.curso, COUNT(a.id_rm) AS total_alunos
    FROM aluno a
    JOIN turma t ON a.id_turma = t.id_turma
    GROUP BY t.curso
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Erro na consulta:', err);
      return res.status(500).json({ erro: 'Erro ao buscar dados' });
    }
    res.json(results);
  });
};