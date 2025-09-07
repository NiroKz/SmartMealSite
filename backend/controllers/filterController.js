const db = require("../config/db");

// Controller para buscar os alunos filtrados
exports.getFilteredStudents = (req, res) => {
  const { course, period, grade } = req.query; // recebe filtros do frontend

  const query = `
    SELECT 
        s.id_rm, 
        s.student_name, 
        m.type_meal, 
        m.access_status
    FROM student s
    JOIN class c 
        ON s.id_class = c.id_class
    LEFT JOIN meal m 
        ON m.id_rm = s.id_rm 
        AND DATE(m.date_time) = CURDATE()
    WHERE c.course = ? 
      AND c.\`period\` = ? 
      AND c.\`grade\` = ?;
`;

  db.query(query, [course, period, grade], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Erro no banco de dados", details: err });
    }

    // Transforma os resultados em JSON com status de cor
    const data = results.map((row) => {
      let status;

      if (row.access_status === "allowed") status = "green";
      else if (row.access_status === "exception") status = "yellow";
      else status = "red"; // não comeu ou não tem registro

      return {
        id_rm: row.id_rm,
        student_name: row.student_name,
        status,
      };
    });

    res.json(data);
  });
};
