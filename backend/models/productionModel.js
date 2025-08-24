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
      `INSERT INTO production
      (id_meal, date_production, quantity_produced, meal_type, shift, remnant, note)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      //INSERT INTO producao 
      //(id_refeicao, data_producao, quantidade_produzida, tipo_refeicao, turno, sobra, observacao)
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
