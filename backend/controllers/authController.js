const tempPasswords = {}; // { [email]: senha_temporaria }

const bcrypt = require("bcrypt");
const crypto = require("crypto");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

exports.register = (req, res) => {
  const { nome, cpf, email, telefone } = req.body;

  if (!nome || !cpf || !email || !telefone) {
    return res.status(400).send("Todos os campos são obrigatórios.");
  }

  User.createUser(nome, cpf, email, telefone, (err, result) => {
    if (err) {
      console.error("Erro ao cadastrar usuário:", err);
      return res.status(500).send("Erro no cadastro.");
    }

    res.redirect("/html/prelogin.html");
    console.log("Cadastro realizado com sucesso");
  });
};

// authController.js
exports.prelogin = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).send("Email é obrigatório.");

  User.findUserByEmail(email, async (err, results) => {
    if (err) return res.status(500).send("Erro no servidor.");
    if (results.length === 0)
      return res.status(404).send("Email não encontrado.");

    const user = results[0];
    const tempPassword = crypto.randomBytes(4).toString("hex");

    // Armazena temporariamente a senha (na RAM do servidor)
    tempPasswords[email] = tempPassword;

    try {
      await axios.post(
        "https://api.resend.com/emails",
        {
          from: "SmartMeal <onboarding@resend.dev>",
          to: email,
          subject: "Sua senha temporária",
          html: `<p>Olá ${user.user_name},</p><p>Sua senha temporária é: <strong>${tempPassword}</strong></p>`,
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      //res.redirect("/html/login.html");
      res.json({ sucesso: true, mensagem: "Email enviado com sucesso! Verifique sua caixa de entrada." });
      console.log("Prelogin realizado com sucesso");
    } catch (emailErr) {
      console.error(
        "Erro ao enviar email:",
        emailErr.response?.data || emailErr
      );
      res.status(500).send("Erro ao enviar email.");
    }
  });
};

exports.login = (req, res) => {
  const { cpf, password } = req.body;

  if (!cpf || !password)
    return res.status(400).send("CPF e senha são obrigatórios.");

  User.findUserByCPF(cpf, (err, results) => {
    if (err) return res.status(500).send("Erro no servidor.");
    if (results.length === 0)
      return res.status(401).send("CPF não encontrado.");

    const user = results[0];
    const email = user.email;
    const tempPassword = tempPasswords[email];

    if (!tempPassword) {
      return res
        .status(400)
        .send("Nenhuma senha temporária foi gerada. Tente novamente.");
    }

    const secret = process.env.JWT_SECRET || "chave_super_secreta"; // ideal usar variável de ambiente

    if (password === tempPassword) {
      delete tempPasswords[email]; // apaga após uso

      const token = jwt.sign(
        {
          id_user: user.id_user, // ✅ mudou de id_usuario para id_user
          email: user.email,
          name: user.user_name,
        },
        secret,
        { expiresIn: "2h" }
      );

      console.log("Login realizado com sucesso");

      return res.json({
        mensagem: "Login bem-sucedido.",
        token,
        usuario: {
          id_user: user.id_user, // ✅ consistente
          name: user.user_name,
          email: user.email,
        },
      });
    } else {
      // Se senha incorreta, responder erro
      return res.status(401).send("Senha incorreta.");
    }
  });
};
