// UserModel.js
const db = require("../config/db");

exports.createUser = (nome, cpf, email, telefone, callback) => {
  const query = "INSERT INTO school_user (user_name, cpf, email, phone, is_user_admin) VALUES (?, ?, ?, ?, false) ";
  db.query(query, [nome, cpf, email, telefone], callback);
};
// INSERT INTO usuario (nome_usuario, cpf, email, fone, is_usuario_admin) VALUES (?, ?, ?, ?, false)

exports.findUserByEmail = (email, callback) => {
  const query = "SELECT * FROM school_user WHERE email = ?";
  db.query(query, [email], callback);
};
// SELECT * FROM usuario WHERE email = ?

exports.findUserByCPF = (cpf, callback) => {
  const query = "SELECT * FROM school_user WHERE cpf = ?";
  db.query(query, [cpf], callback);
};
// SELECT * FROM usuario WHERE cpf = ?