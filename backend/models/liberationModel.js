const db = require("../config/db");

const formatDateTimeForMySQL = (date) => {
  const d = new Date(date);
  return d.toISOString().slice(0, 19).replace("T", " ");
};

const createLiberation = async (
  studentId,
  datetime,
  reason,
  mealType,
  permissionType,
  canRepeat
) => {
  const formattedDateTime = formatDateTimeForMySQL(datetime);

  const query = `
    INSERT INTO release_exception
    (id_rm, meal_type, type_release, date_time, reason, allow_repeat)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const values = [
    studentId,
    mealType,
    permissionType === "temporary" ? "temporary" : "permanent",
    formattedDateTime,
    reason,
    canRepeat ? "yes" : "no",  // 🔹 agora bate com ENUM
  ];

  const [result] = await db.execute(query, values);
  return result;
};

module.exports = { createLiberation };
