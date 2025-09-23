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

module.exports = {
  fetchStudentAccessDataToday,
};
