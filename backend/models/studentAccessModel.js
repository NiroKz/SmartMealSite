const db = require("../config/db");

const fetchStudentAccessDataToday = async () => {
  const query = `
    SELECT 
      (SELECT COUNT(DISTINCT id_rm) FROM meal WHERE DATE(date_time) = CURDATE()) AS total_today,
      (SELECT COUNT(*) FROM student) AS total_students,
      (SELECT COUNT(*) FROM meal WHERE type_meal = 'lunch' AND DATE(date_time) = CURDATE()) AS lunch_count,
      (SELECT COUNT(*) FROM meal WHERE type_meal = 'dinner' AND DATE(date_time) = CURDATE()) AS dinner_count
  `;

  const [results] = await db.execute(query);
  return results[0];
};

const fetchStudentAccessMonth = async (year, month) => {
  const query = `
    SELECT 
      DATE(date_time) AS day,
      COUNT(DISTINCT id_rm) AS total,
      SUM(CASE WHEN type_meal = 'lunch' THEN 1 ELSE 0 END) AS lunch_count,
      SUM(CASE WHEN type_meal = 'dinner' THEN 1 ELSE 0 END) AS dinner_count
    FROM meal
    WHERE YEAR(date_time) = ? AND MONTH(date_time) = ?
    GROUP BY DATE(date_time)
    ORDER BY DATE(date_time);
  `;

  const [results] = await db.execute(query, [year, month]);
  return results;
};

module.exports = {
  fetchStudentAccessDataToday,
  fetchStudentAccessMonth, // <--- ADICIONE ESTA LINHA
};
