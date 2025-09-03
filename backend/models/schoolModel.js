const db = require("../config/db");

const school = {
  criar: (dados, callback) => {
    const { id_user, nome_escola, rua_endereco, fone } = dados;

    const sql = `
      INSERT INTO school (id_user, school_name, address_road, phone)
      VALUES (?, ?, ?, ?)
    `;

    db.query(sql, [id_user, nome_escola, rua_endereco, fone], callback);
  },
};

module.exports = school;
