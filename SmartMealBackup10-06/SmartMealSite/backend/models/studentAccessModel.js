const db = require("../config/db");

const fetchStudentAccessDataToday = () => {
  const query = `
    SELECT
  (SELECT COUNT(DISTINCT id_rm) FROM refeicao WHERE DATE(data_hora) = CURDATE()) AS total_today,
  (SELECT COUNT(*) FROM aluno) AS total_students,
  (SELECT COUNT(*) FROM refeicao WHERE tipo_refeicao = 'almoço' AND DATE(data_hora) = CURDATE()) AS lunch_count,
  (SELECT COUNT(*) FROM refeicao WHERE tipo_refeicao = 'jantar' AND DATE(data_hora) = CURDATE()) AS dinner_count;
  `;
  return new Promise((resolve, reject) => {
    db.query(query, (err, results) => {
      if (err) return reject(err);
      resolve(results[0]);
    });
  });
};

module.exports = {
  fetchStudentAccessDataToday,
};
