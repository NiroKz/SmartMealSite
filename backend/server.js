require("dotenv").config(); // Carrega variáveis do .env

// Carrega os módulos que foram isntalados pelo "npm install ..."
const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const axios = require("axios"); // Para chamada da API Resend

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

// Conexão com MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) throw err;
  console.log("Conectado ao MySQL!");
});

// Rota de cadastro (sem senha)
app.post("/register", (req, res) => {
  const { nome, cpf, email, telefone } = req.body;

  if (!nome || !cpf || !email || !telefone) {
    return res.status(400).send("Todos os campos são obrigatórios.");
  }

  const query =
    "INSERT INTO usuarios (nome, cpf, email, telefone) VALUES (?, ?, ?, ?)";
  db.query(query, [nome, cpf, email, telefone], (err, result) => {
    if (err) {
      console.error("Erro ao cadastrar usuário:", err);
      return res.status(500).send("Erro no cadastro.");
    }

    res.redirect("/html/prelogin.html");
    console.log("Cadastro realizado com sucesso");
  });
});

// Rota para gerar e enviar senha temporária
app.post("/prelogin", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).send("Email é obrigatório.");

  const queryFind = "SELECT * FROM usuarios WHERE email = ?";
  db.query(queryFind, [email], async (err, results) => {
    if (err) return res.status(500).send("Erro no servidor.");
    if (results.length === 0)
      return res.status(404).send("Email não encontrado.");

    const user = results[0];
    const tempPassword = crypto.randomBytes(4).toString("hex"); // Ex: 'a1b2c3d4'
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const queryUpdate = "UPDATE usuarios SET senha = ? WHERE id = ?";
    db.query(queryUpdate, [hashedPassword, user.id], async (err) => {
      if (err) return res.status(500).send("Erro ao atualizar senha.");

      // Enviar senha com API do Resend
      try {
        const response = await axios.post(
          "https://api.resend.com/emails",
          {
            from: "SmartMeal <onboarding@resend.dev>",
            to: email,
            subject: "Sua senha temporária",
            html: `<p>Olá ${user.nome},</p><p>Sua senha temporária é: <strong>${tempPassword}</strong></p>`,
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        res.redirect("/html/login.html");
        console.log("Prelogin realizado com sucesso");
      } catch (emailErr) {
        console.error(
          "Erro ao enviar email:",
          emailErr.response?.data || emailErr
        );
        res.status(500).send("Erro ao enviar email.");
      }
    });
  });
});

// Rota de login com CPF e senha temporária
app.post("/login", (req, res) => {
  const { cpf, password } = req.body;

  if (!cpf || !password)
    return res.status(400).send("CPF e senha são obrigatórios.");

  const query = "SELECT * FROM usuarios WHERE cpf = ?";
  db.query(query, [cpf], async (err, results) => {
    if (err) return res.status(500).send("Erro no servidor.");
    if (results.length === 0)
      return res.status(401).send("CPF não encontrado.");

    const user = results[0];

    if (!user.senha) {
      return res
        .status(400)
        .send(
          'Senha temporária ainda não foi gerada. Vá para "Esqueci minha senha".'
        );
    }

    try {
      const isPasswordCorrect = await bcrypt.compare(password, user.senha);
      if (isPasswordCorrect) {
        res.redirect("/html/hall.html");
        console.log("Login realizado com sucesso");
      } else {
        res
          .status(401)
          .send(
            '<h2>Senha incorreta.</h2><a href="/html/login.html">Tentar novamente</a>'
          );
      }
    } catch (error) {
      console.error("Erro ao comparar senha:", error);
      res.status(500).send("Erro no servidor.");
    }
  });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
