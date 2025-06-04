const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // ← para aceitar JSON no corpo das requisições
app.use(express.static('public'));

// Conexão com MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'gabe@bill_77', // sua senha
  database: 'smartmeal'
});

db.connect(err => {
  if (err) throw err;
  console.log('Conectado ao MySQL!');
});

// Rota de cadastro
app.post('/register', async (req, res) => {
  console.log('Dados recebidos no /register:', req.body);

  const { nome, cpf, email, telefone, senha } = req.body;

  if (!nome || !cpf || !email || !telefone || !senha) {
    return res.status(400).send('Todos os campos são obrigatórios.');
  }

  try {
    const hashedPassword = await bcrypt.hash(senha, 10);

    const query = 'INSERT INTO usuarios (nome, cpf, email, telefone, senha) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [nome, cpf, email, telefone, hashedPassword], (err, result) => {
      if (err) {
        console.error('Erro ao cadastrar usuário:', err);
        return res.status(500).send('Erro no cadastro.');
      }

      console.log('Usuário cadastrado com sucesso!');
      res.send('<h2>Cadastro realizado com sucesso!</h2><a href="/html/login.html">Ir para login</a>');
    });
  } catch (error) {
    console.error('Erro ao hashear a senha:', error);
    res.status(500).send('Erro no servidor.');
  }
});

// Rota de login
app.post('/login', (req, res) => {
  console.log('Dados recebidos no /login:', req.body);

  const { cpf, password } = req.body;

  if (!cpf || !password) {
    return res.status(400).send('CPF e senha são obrigatórios.');
  }

  const query = 'SELECT * FROM usuarios WHERE cpf = ?';
  db.query(query, [cpf], async (err, results) => {
    if (err) {
      console.error('Erro no login:', err);
      return res.status(500).send('Erro no servidor.');
    }

    if (results.length === 0) {
      return res.status(401).send('<h2>CPF não encontrado.</h2><a href="/html/login.html">Voltar</a>');
    }

    const user = results[0];
    try {
      const isPasswordCorrect = await bcrypt.compare(password, user.senha);

      if (isPasswordCorrect) {
        res.send(`<h2>Bem-vindo, ${user.nome}!</h2><a href="/">Voltar</a>`);
      } else {
        res.status(401).send('<h2>Senha incorreta.</h2><a href="/html/login.html">Tentar novamente</a>');
      }
    } catch (error) {
      console.error('Erro ao comparar senha:', error);
      res.status(500).send('Erro no servidor.');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
