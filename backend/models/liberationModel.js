const connection = require('../config/db');

const formatDateTimeForMySQL = (date) => {
  const d = new Date(date);
  return d.toISOString().slice(0, 19).replace('T', ' ');
};

const createLiberation = (studentId, datetime, reason) => {
  return new Promise((resolve, reject) => {
    const formattedDateTime = formatDateTimeForMySQL(datetime);
    const query = 'INSERT INTO liberacao_excecao (id_rm, data_horario, motivo) VALUES (?, ?, ?)';
    connection.query(query, [studentId, formattedDateTime, reason], (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};


module.exports = { createLiberation };