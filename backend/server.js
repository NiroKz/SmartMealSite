const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

// Rotas
const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

const graphicRoutes = require('./routes/graphicRoutes');
app.use('/graphic', graphicRoutes);

const schoolRoutes = require('./routes/schoolRoutes');
app.use('/school', schoolRoutes);

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
