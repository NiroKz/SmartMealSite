const db = require("../config/db");

exports.getFilteredStudents = (req, res) => {
  const { course, period, grade } = req.query;

  const query = `
    SELECT 
        s.id_rm, 
        s.student_name,
        MAX(CASE WHEN m.type_meal = 'lunch' THEN m.access_status END) AS lunch_status,
        MAX(CASE WHEN m.type_meal = 'lunch' THEN m.date_time END) AS lunch_time,
        MAX(CASE WHEN m.type_meal = 'dinner' THEN m.access_status END) AS dinner_status,
        MAX(CASE WHEN m.type_meal = 'dinner' THEN m.date_time END) AS dinner_time
    FROM student s
    JOIN class c 
        ON s.id_class = c.id_class
    LEFT JOIN meal m 
        ON m.id_rm = s.id_rm 
        AND DATE(m.date_time) = CURDATE()
    WHERE c.course = ? 
      AND c.\`period\` = ? 
      AND c.\`grade\` = ?
    GROUP BY s.id_rm, s.student_name;
  `;

  db.query(query, [course, period, grade], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Erro no banco de dados", details: err });
    }

    const getColor = (status) => {
      if (status === "allowed") return "green"; // comeu
      if (status === "exception") return "yellow"; // podia comer mas não comeu
      return "red"; // não podia comer
    };

    const data = results.map((row) => ({
      id_rm: row.id_rm,
      student_name: row.student_name,
      lunch: {
        status: getColor(row.lunch_status),
        time: row.lunch_status === "allowed" ? row.lunch_time : null,
      },
      dinner: {
        status: getColor(row.dinner_status),
        time: row.dinner_status === "allowed" ? row.dinner_time : null,
      },
    }));

    res.json(data);
  });
};
