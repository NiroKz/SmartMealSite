const db = require('../config/db');

const insertProduction = (productionData) => {
  return new Promise((resolve, reject) => {
    const {
      mealId,
      productionDate,
      quantityProduced,
      mealType,
      shift,
      leftovers,
      notes
    } = productionData;

    db.execute(
      `INSERT INTO producao 
      (id_refeicao, data_producao, quantidade_produzida, tipo_refeicao, turno, sobra, observacao)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [mealId, productionDate, quantityProduced, mealType, shift, leftovers, notes],
      (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
    );
  });
};

module.exports = { insertProduction };
