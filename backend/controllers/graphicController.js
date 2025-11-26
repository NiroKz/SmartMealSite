const db = require("../config/db");

exports.studentsCurses = async (req, res) => {
  try {
    const query = `
      SELECT 
        c.course,
        COUNT(m.id_meal) AS total_students
      FROM meal m
      JOIN student s ON m.id_rm = s.id_rm
      JOIN class c ON s.id_class = c.id_class
      WHERE DATE(m.date_time) = CURDATE()
      GROUP BY c.course
    `;

    const [results] = await db.query(query);

    return res.json(results);
  } catch (err) {
    console.error("Erro na consulta:", err);
    return res.status(500).json({ erro: "Erro ao buscar dados" });
  }
};
