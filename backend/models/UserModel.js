const db = require("../config/db");

async function createUser(nome, cpf, email, telefone) {
  const query = `
    INSERT INTO school_user (user_name, cpf, email, phone, is_user_admin) 
    VALUES (?, ?, ?, ?, false)
  `;
  const [result] = await db.execute(query, [nome, cpf, email, telefone]);
  return result;
}

async function findUserByEmail(email) {
  const query = "SELECT * FROM school_user WHERE email = ?";
  const [rows] = await db.execute(query, [email]);
  return rows; // retorna array
}

async function findUserByCPF(cpf) {
  const query = "SELECT * FROM school_user WHERE cpf = ?";
  const [rows] = await db.execute(query, [cpf]);
  return rows; // retorna array
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserByCPF,
};
