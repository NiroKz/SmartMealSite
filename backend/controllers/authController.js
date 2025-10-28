const db = require("../config/db");

const tempPasswords = {}; // { [email]: senha_temporaria }

const bcrypt = require("bcrypt");
const crypto = require("crypto");
const axios = require("axios");
const jwt = require("jsonwebtoken");
const User = require("../models/UserModel");

// Registro de usuário
exports.register = async (req, res) => {
  try {
    const { nome, cpf, email, telefone } = req.body;

    if (!nome || !cpf || !email || !telefone) {
      return res.status(400).send("Todos os campos são obrigatórios.");
    }

    const result = await User.createUser(nome, cpf, email, telefone);

    console.log("Cadastro realizado com sucesso");
    return res.json(result);
    // opcional: res.redirect("/html/prelogin.html");
  } catch (err) {
    console.error("Erro ao cadastrar usuário:", err);
    return res.status(500).send("Erro no cadastro.");
  }
};

// Prelogin
exports.prelogin = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).send("Email é obrigatório.");

  try {
    const results = await User.findUserByEmail(email);

    if (results.length === 0) {
      return res.status(404).send("Email não encontrado.");
    }

    const user = results[0];
    const tempPassword = crypto.randomBytes(4).toString("hex");

    // Armazena temporariamente
    tempPasswords[email] = tempPassword;

    await axios.post(
      "https://api.resend.com/emails",
      {
        from: "SmartMeal <onboarding@resend.dev>",
        to: email,
        subject: "Sua senha temporária - SmartMeal",
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <img src="..\..\public\images\SmartMealLogo.png" alt="SmartMeal" style="width: 120px;" />
          </div>
          <h2 style="color: #333;">Olá ${user.user_name},</h2>
          <p style="font-size: 16px; color: #555;">Você solicitou uma senha temporária para acessar o <strong>SmartMeal</strong>. Use-a para fazer login:</p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="display: inline-block; background: #4CAF50; color: #fff; font-weight: bold; font-size: 18px; padding: 10px 20px; border-radius: 5px;">${tempPassword}</span>
          </div>
          <p style="font-size: 14px; color: #777;">Essa senha é de uso único.</p>
          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;" />
          <p style="font-size: 12px; color: #999;">Se você não solicitou esta senha, ignore este e-mail.</p>
        </div>
        <p style="font-size:12px; color:#999;">
        SmartMeal - www.smartmeal.com.br | contato@smartmeal.com.br
        </p>
        `,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Prelogin realizado com sucesso");
    return res.json({
      sucesso: true,
      mensagem: "Email enviado com sucesso! Verifique sua caixa de entrada.",
    });
  } catch (err) {
    console.error("Erro no prelogin:", err.response?.data || err);
    return res.status(500).send("Erro ao enviar email.");
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { cpf, password } = req.body;

    if (!cpf || !password)
      return res.status(400).send("CPF e senha são obrigatórios.");

    const results = await User.findUserByCPF(cpf);

    if (results.length === 0) {
      return res.status(401).send("CPF não encontrado.");
    }

    const user = results[0];
    const email = user.email;
    const tempPassword = tempPasswords[email];

    if (!tempPassword) {
      return res
        .status(400)
        .send("Nenhuma senha temporária foi gerada. Tente novamente.");
    }

    const secret = process.env.JWT_SECRET || "chave_super_secreta";

    if (password === tempPassword) {
      delete tempPasswords[email]; // apaga após uso

      // 🔹 Busca as permissões desse usuário
      const [rows] = await db.query("SELECT * FROM access WHERE id_user = ?", [
        user.id_user,
      ]);
      const permissions = rows[0] || {};

      const token = jwt.sign(
        {
          id_user: user.id_user,
          email: user.email,
          name: user.user_name,
          permissions: permissions || {} // 🔹 inclui as permissões no token
        },
        secret,
        { expiresIn: "2h" }
      );

      console.log("Login realizado com sucesso");

      return res.json({
        mensagem: "Login bem-sucedido.",
        token,
        usuario: {
          id_user: user.id_user,
          name: user.user_name,
          email: user.email,
        },
      });
    } else {
      return res.status(401).send("Senha incorreta.");
    }
  } catch (err) {
    console.error("Erro no login:", err);
    return res.status(500).send("Erro no servidor.");
  }
};
