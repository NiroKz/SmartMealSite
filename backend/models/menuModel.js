const db = require("../config/db");

module.exports = {
  getMealTypes: async () => {
    const query = "SELECT DISTINCT meal_type FROM production";
    const [rows] = await db.execute(query);
    return rows;
  },

  insertMenu: async (data) => {
    const query = `
      INSERT INTO menu (date_time, meal_type, product_name_1, product_name_2, product_name_3, product_name_4)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const params = [
      data.date_time,
      data.meal_type,
      data.product_name_1,
      data.product_name_2,
      data.product_name_3,
      data.product_name_4,
    ];

    const [result] = await db.execute(query, params);
    return result;
  },

  getMenuWeek: async () => {
    const query = `
  SELECT 
    DAYOFWEEK(date_time) AS weekday,
    meal_type,
    product_name_1,
    product_name_2,
    product_name_3,
    product_name_4
  FROM menu
  WHERE WEEK(date_time) = WEEK(NOW())
  ORDER BY meal_type ASC, weekday ASC
`;

    const [rows] = await db.execute(query);
    return rows;
  },
};
