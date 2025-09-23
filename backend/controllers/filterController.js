const db = require("../config/db");

exports.getFilteredStudents = async (req, res) => {
  try {
    const { course, period: classPeriod, grade, date } = req.query;

    const query = `
      SELECT
        s.id_rm,
        s.student_name,
        MAX(CASE WHEN m.type_meal = 'lunch' THEN m.date_time END) AS lunch_time,
        MAX(CASE WHEN m.type_meal = 'dinner' THEN m.date_time END) AS dinner_time,
        GROUP_CONCAT(
          CASE WHEN m.type_meal = 'lunch' AND m.id_meal <> (
            SELECT MIN(m2.id_meal)
            FROM meal m2
            WHERE m2.id_rm = s.id_rm AND DATE(m2.date_time) = ? AND m2.type_meal = 'lunch'
          ) THEN DATE_FORMAT(m.date_time, '%H:%i') END
          SEPARATOR ', '
        ) AS lunch_repeat_times,
        GROUP_CONCAT(
          CASE WHEN m.type_meal = 'dinner' AND m.id_meal <> (
            SELECT MIN(m2.id_meal)
            FROM meal m2
            WHERE m2.id_rm = s.id_rm AND DATE(m2.date_time) = ? AND m2.type_meal = 'dinner'
          ) THEN DATE_FORMAT(m.date_time, '%H:%i') END
          SEPARATOR ', '
        ) AS dinner_repeat_times
      FROM student s
      JOIN class c ON s.id_class = c.id_class
      LEFT JOIN meal m ON m.id_rm = s.id_rm AND DATE(m.date_time) = ?
      WHERE c.course = ? AND c.period = ? AND c.grade = ?
      GROUP BY s.id_rm, s.student_name
      ORDER BY s.student_name
    `;

    const [results] = await db.query(query, [date, date, date, course, classPeriod, grade]);

    const data = results.map((row) => {
      function getStatus(mealType, time) {
        const ate = !!time;
        const hasRight =
          (mealType === "lunch" && (classPeriod === "M" || classPeriod === "T")) ||
          (mealType === "dinner" && classPeriod === "N");

        if (ate) return "green";   // comeu
        if (hasRight) return "yellow"; // podia comer mas não apareceu
        return "red";              // não tinha direito
      }

      return {
        id_rm: row.id_rm,
        student_name: row.student_name,
        lunch: {
          status: getStatus("lunch", row.lunch_time),
          time: row.lunch_time || null,
          repeat_times: row.lunch_repeat_times || "--/--"
        },
        dinner: {
          status: getStatus("dinner", row.dinner_time),
          time: row.dinner_time || null,
          repeat_times: row.dinner_repeat_times || "--/--"
        }
      };
    });

    return res.json(data);
  } catch (err) {
    console.error("Erro no banco de dados:", err);
    return res.status(500).json({ error: "Erro no banco de dados", details: err.message });
  }
};
