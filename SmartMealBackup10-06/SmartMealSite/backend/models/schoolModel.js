const db = require('../config/db');

const school = {
    criar: (dados, callback) => {
        const { id_usuario, nome_escola, rua_endereco, fone } = dados;

        const sql = `
            INSERT INTO escola (id_usuario, nome_escola, rua_endereco, fone)
            VALUES (?, ?, ?, ?)
        `;

        db.query(sql, [id_usuario, nome_escola, rua_endereco, fone], (err, result) => {
            if (err) return callback(err);
            callback(null, result);
        });
    }
};

module.exports = school;