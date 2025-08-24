const db = require('../config/db');

const school = {
    criar: (dados, callback) => {
        const { id_usuario, nome_escola, rua_endereco, fone } = dados;

        const sql = `
            INSERT INTO school (id_user, school_name, address_road, phone)
            VALUES (?, ?, ?, ?)
        `;

        db.query(sql, [id_usuario, nome_escola, rua_endereco, fone], (err, result) => {
            if (err) return callback(err);
            callback(null, result);
        });
    }
};

module.exports = school;