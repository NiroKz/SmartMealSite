const mysql = require("mysql2");
require("dotenv").config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306, // cuidado: essa é a porta do MySQL
  waitForConnections: true,
  connectionLimit: 10, // máximo de conexões simultâneas
  queueLimit: 0,
  connectTimeout: 20000
});

// Exporta já como pool de promessas
module.exports = pool.promise();
