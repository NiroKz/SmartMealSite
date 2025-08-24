const connection = require("../config/db");

const formatDateTimeForMySQL = (date) => {
  const d = new Date(date);
  return d.toISOString().slice(0, 19).replace("T", " ");
};

const createLiberation = (
  studentId,
  datetime,
  reason,
  mealType,
  permissionType,
  canRepeat
) => {
  return new Promise((resolve, reject) => {
    const formattedDateTime = formatDateTimeForMySQL(datetime);
    const query = `
        INSERT INTO release_exception
        (id-rm, meal_type, type_release, date_time, reason, allow_repeat)
        VALUES (?, ?, ?, ?, ?, ?, ?)`;

    //INSERT INTO liberacao_excecao
    //(id_rm, tipo_refeicao, tipo_permissao, data_permitida, data_horario, motivo, permitir_repeticao)

    const values = [
      studentId,
      mealType,
      permissionType === "temporary" ? "temporária" : "permanente",
      formattedDateTime.split(" ")[0],
      formattedDateTime,
      reason,
      canRepeat ? 1 : 0,
    ];

    connection.query(query, values, (err, results) => {
      if (err) return reject(err);
      resolve(results);
    });
  });
};

module.exports = { createLiberation };
