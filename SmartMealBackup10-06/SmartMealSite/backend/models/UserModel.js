// UserModel.js
const db = require("../config/db");

exports.createUser = (nome, cpf, email, telefone, callback) => {
  const query = "INSERT INTO usuario (nome_usuario, cpf, email, fone, is_usuario_admin) VALUES (?, ?, ?, ?, false)";
  db.query(query, [nome, cpf, email, telefone], callback);
};

exports.findUserByEmail = (email, callback) => {
  const query = "SELECT * FROM usuario WHERE email = ?";
  db.query(query, [email], callback);
};

exports.findUserByCPF = (cpf, callback) => {
  const query = "SELECT * FROM usuario WHERE cpf = ?";
  db.query(query, [cpf], callback);
};