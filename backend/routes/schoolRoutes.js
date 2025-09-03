const express = require("express");
const router = express.Router();
const Escola = require("../models/schoolModel");
const db = require("../config/db");
const autenticarToken = require("../middleware/authMiddleware"); // Adicione isso

router.post("/addSchools", autenticarToken, (req, res) => {
  console.log("req.body:", req.body);
  console.log("req.usuario:", req.usuario);

  const { nome_escola, rua_endereco, fone } = req.body; // <- nomes corretos do HTML
  const { id_user } = req.usuario;

  if (!id_user || !nome_escola || !rua_endereco || !fone) {
    return res.status(400).json({ erro: "Preencha todos os campos!" });
  }

  Escola.criar({ id_user, nome_escola, rua_endereco, fone }, (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({ erro: "Nome da escola já cadastrado." });
      }
      return res.status(500).json({ erro: "Erro no servidor." });
    }

    console.log("Escola cadastrada com sucesso");
    res.status(201).json({ sucesso: "Escola cadastrada com sucesso!" });
  });
});


router.get("/listSchool", autenticarToken, (req, res) => {
  const { id_user } = req.usuario; // ✅ também aqui

  const sql =
    "SELECT school_name, address_road, phone FROM school WHERE id_user = ?";
  db.query(sql, [id_user], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ erro: "Erro ao buscar escolas." });
    }

    res.json(results);
  });
});

module.exports = router;
