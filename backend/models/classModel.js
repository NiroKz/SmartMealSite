// models/classModel.js

const db = require("../config/db");

// Função para inserir uma nova turma no banco.
async function createClass(course, period, grade, date_registration) {
  const sql = `
    INSERT INTO class (course, period, grade, date_registration) 
    VALUES (?, ?, ?, ?)
  `;

  const values = [course, period, grade, date_registration];

  try {
    const [result] = await db.execute(sql, values);
    return result; // retorna o resultado para o controller
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createClass
};
