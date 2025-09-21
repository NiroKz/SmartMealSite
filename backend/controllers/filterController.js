// filterController.js
const db = require("../config/db");

exports.getFilteredStudents = (req, res) => {
  const { course, period: classPeriod, grade, date } = req.query;

  // Adicione este log para verificar se os dados estão chegando
  console.log("Parâmetros de filtro recebidos:", {
    course,
    classPeriod,
    grade,
    date,
  });

  const query = `
  SELECT
        s.id_rm,
        s.student_name,
        COUNT(CASE WHEN m.type_meal = 'lunch' AND m.access_status = 'allowed' THEN 1 ELSE NULL END) AS lunch_allowed_count,
        COUNT(CASE WHEN m.type_meal = 'dinner' AND m.access_status = 'allowed' THEN 1 ELSE NULL END) AS dinner_allowed_count,
        COUNT(CASE WHEN m.type_meal = 'lunch' AND m.access_status = 'exception' THEN 1 ELSE NULL END) AS lunch_exception_count,
        COUNT(CASE WHEN m.type_meal = 'dinner' AND m.access_status = 'exception' THEN 1 ELSE NULL END) AS dinner_exception_count,
        MAX(CASE WHEN m.type_meal = 'lunch' THEN m.date_time END) AS lunch_time,
        MAX(CASE WHEN m.type_meal = 'dinner' THEN m.date_time END) AS dinner_time
      FROM student s
      JOIN class c ON s.id_class = c.id_class
      LEFT JOIN meal m ON m.id_rm = s.id_rm AND DATE(m.date_time) = ?
      WHERE c.course = ? AND c.period = ? AND c.grade = ?
      GROUP BY s.id_rm, s.student_name
      ORDER BY s.student_name;
 `;

  db.query(query, [date, course, classPeriod, grade], (err, results) => {
    if (err) {
      // ESTE É O PASSO MAIS IMPORTANTE
      // Imprime o erro completo do MySQL no console do servidor
      console.error("Erro do banco de dados:", err);
      return res
        .status(500)
        .json({ error: "Erro no banco de dados", details: err.message }); // Envia apenas a mensagem de erro para o frontend
    }

    const data = results.map((row) => {
      // Determina o status do almoço
      let lunchStatus;
      if (row.lunch_allowed_count > 0) {
        lunchStatus = "green"; // podia comer e comeu
      } else if (row.lunch_exception_count > 0) {
        lunchStatus = "yellow"; // podia comer, mas não registrou hora
      } else {
        lunchStatus = "red"; // não podia comer e não comeu
      }

      // Determina o status da janta
      let dinnerStatus;
      if (row.dinner_allowed_count > 0) {
        dinnerStatus = "green";
      } else if (row.dinner_exception_count > 0) {
        dinnerStatus = "yellow";
      } else {
        dinnerStatus = "red";
      }

      return {
        id_rm: row.id_rm,
        student_name: row.student_name,
        lunch: {
          status: lunchStatus,
          time: row.lunch_time || null,
        },
        dinner: {
          status: dinnerStatus,
          time: row.dinner_time || null,
        },
      };
    });

    res.json(data);
  });
};
