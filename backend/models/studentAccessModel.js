const db = require("../config/db");

const fetchStudentAccessDataToday = () => {
  const query = `
     SELECT 
   (SELECT COUNT(DISTINCT id_rm) FROM meal WHERE DATE(date_time) = CURDATE()) AS total_today,
   (SELECT COUNT(*) FROM student) AS total_students,
   (SELECT COUNT(*) FROM meal WHERE type_meal = 'lunch' AND DATE(date_time) = CURDATE()) AS lunch_count,
   (SELECT COUNT(*) FROM meal WHERE type_meal = 'dinner' AND DATE(date_time) = CURDATE()) AS dinner_count;
  `;
  /* 
  SELECT
  (SELECT COUNT(DISTINCT id_rm) FROM refeicao WHERE DATE(data_hora) = CURDATE()) AS total_today,
  (SELECT COUNT(*) FROM aluno) AS total_students,
  (SELECT COUNT(*) FROM refeicao WHERE tipo_refeicao = 'almoço' AND DATE(data_hora) = CURDATE()) AS lunch_count,
  (SELECT COUNT(*) FROM refeicao WHERE tipo_refeicao = 'jantar' AND DATE(data_hora) = CURDATE()) AS dinner_count;*/
  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) return reject(err);
      console.log("Resultado da query studentAccess:", results[0]);
      resolve(results[0]);
    });
  });
};

module.exports = {
  fetchStudentAccessDataToday,
};
