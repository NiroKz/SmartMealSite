const db = require("../config/db");

const school = {
  criar: async (dados) => {
    const { id_user, nome_escola, rua_endereco, fone } = dados;

    const sql = `
      INSERT INTO school (id_user, school_name, address_road, phone)
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await db.execute(sql, [
      id_user,
      nome_escola,
      rua_endereco,
      fone,
    ]);

    return result;
  },
};

module.exports = school;
