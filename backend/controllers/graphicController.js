const db = require("../config/db");

exports.studentsCurses = async (req, res) => {
  try {
    const query = `
      SELECT c.course, COUNT(s.id_rm) AS total_students
      FROM student s
      JOIN class c ON s.id_class = c.id_class
      GROUP BY c.course
    `;

    const [results] = await db.query(query);

    return res.json(results);
  } catch (err) {
    console.error("Erro na consulta:", err);
    return res.status(500).json({ erro: "Erro ao buscar dados" });
  }
};
