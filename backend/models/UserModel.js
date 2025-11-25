const db = require("../config/db");

async function createUser(nome, cpf, email, telefone, is_user_admin) {
  const query = `
    INSERT INTO school_user (user_name, cpf, email, phone, is_user_admin) 
    VALUES (?, ?, ?, ?, ?)
  `;

  const [result] = await db.execute(query, [
    nome,
    cpf,
    email,
    telefone,
    is_user_admin,
  ]);

  // Pega o ID do usuário criado
  const newUserId = result.insertId;

  // Se for ADMIN → permissões totais
  if (is_user_admin == 1) {
    await db.query(
      `INSERT INTO access (
        id_user, 
        access_stock, 
        access_production, 
        access_accesses, 
        access_student_register, 
        access_reports, 
        access_student_perm, 
        access_class_register
      ) VALUES (?, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE, TRUE)`,
      [newUserId]
    );

  } else {
    // Se for usuário comum → permissões básicas
    await db.query(
      `INSERT INTO access (
        id_user, 
        access_stock, 
        access_production, 
        access_accesses, 
        access_student_register, 
        access_reports, 
        access_student_perm, 
        access_class_register
      ) VALUES (?, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE)`,
      [newUserId]
    );
  }

  return result;
}

async function findUserByEmail(email) {
  const query = "SELECT * FROM school_user WHERE email = ?";
  const [rows] = await db.execute(query, [email]);
  return rows;
}

async function findUserByCPF(cpf) {
  const query = "SELECT * FROM school_user WHERE cpf = ?";
  const [rows] = await db.execute(query, [cpf]);
  return rows;
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserByCPF,
};