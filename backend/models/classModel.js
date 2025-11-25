const db = require("../config/db");

async function createClass(course, period, grade) {
  await db.execute(
    `INSERT INTO class (course, period, grade, date_registration)
     VALUES (?, ?, ?, CURDATE())`,
    [course, period, grade]
  );
}

async function getAllClasses() {
  const [rows] = await db.execute(`SELECT * FROM class`);
  return rows;
}

async function getClassById(id) {
  const [rows] = await db.execute(`SELECT * FROM class WHERE id_class = ?`, [id]);
  return rows[0];
}

async function updateClass(id, course, period, grade) {
  await db.execute(
    `UPDATE class SET course=?, period=?, grade=? WHERE id_class=?`,
    [course, period, grade, id]
  );
}

async function deleteClass(id) {
  await db.execute(`DELETE FROM class WHERE id_class = ?`, [id]);
}

module.exports = {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass
};
