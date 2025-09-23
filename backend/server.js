const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
//const API_BASE_URL = process.env.API_BASE_URL;
// URL do frontend no Render
const FRONTEND_URL = process.env.FRONTEND_URL || "https://smartmealsite.onrender.com";

// Middlewares
app.use(cors({
  origin: FRONTEND_URL,   // só permite requisições do front
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

// Rotas
const authRoutes = require("./routes/authRoutes");
app.use("/auth", authRoutes);

const graphicRoutes = require("./routes/graphicRoutes");
app.use("/graphic", graphicRoutes);

const schoolRoutes = require("./routes/schoolRoutes");
app.use("/school", schoolRoutes);

const studentAccessRoutes = require("./routes/studentAccessRoutes");
app.use("/studentAccess", studentAccessRoutes);

const studentLiberationRoute = require("./routes/liberationRoutes");
app.use("/studentLiberation", studentLiberationRoute);

const productionRoutes = require("./routes/productionRoutes");
app.use("/production", productionRoutes);

const filterRoutes = require("./routes/filterRoutes");
app.use("/filter", filterRoutes);

const productRoutes = require("./routes/productRoutes");
app.use("/product", productRoutes);

const feedbackRoutes = require('./routes/feedbackRoutes');
app.use('/feedback', feedbackRoutes);

const studentRoutes = require("./routes/studentRoutes");
app.use("/student", studentRoutes);

const stockRoutes = require("./routes/stockRoutes");
app.use("/stock", stockRoutes);

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Erro interno no servidor." });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`✅ Servidor rodando no Railway em porta ${PORT}`);
});
