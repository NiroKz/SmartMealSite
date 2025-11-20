const express = require("express");
const router = express.Router();
const db = require("../config/db"); // pool.promise()
const autenticarToken = require("../middleware/authMiddleware");

// Cadastrar escola
router.post("/addSchools", autenticarToken, async (req, res) => {
  try {
    const { nome_escola, rua_endereco, fone } = req.body;
    const { id_user } = req.usuario;

    if (!id_user || !nome_escola || !rua_endereco || !fone) {
      return res.status(400).json({ erro: "Preencha todos os campos!" });
    }

    const sql = `
      INSERT INTO school (id_user, school_name, address_road, phone)
      VALUES (?, ?, ?, ?)
    `;

    await db.query(sql, [id_user, nome_escola, rua_endereco, fone]);

    console.log("Escola cadastrada com sucesso");
    res.status(201).json({ sucesso: "Escola cadastrada com sucesso!" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ erro: "Nome da escola já cadastrado." });
    }
    console.error("Erro ao cadastrar escola:", err);
    res.status(500).json({ erro: "Erro no servidor." });
  }
});

// Listar escolas do usuário
router.get("/listSchool", autenticarToken, async (req, res) => {
  try {
    const { id_user } = req.usuario;

    const sql =
      "SELECT school_name, address_road, phone FROM school";

    const [results] = await db.query(sql, [id_user]);

    res.json(results);
  } catch (err) {
    console.error("Erro ao buscar escolas:", err);
    res.status(500).json({ erro: "Erro ao buscar escolas." });
  }
});

module.exports = router;
