// routes.js
const express = require("express");
const router = express.Router();
const db = require("../config/db");
const filterController = require("../controllers/filterController");

// Rota de filtro de alunos
router.get("/students", filterController.getFilteredStudents);

// Rota de cursos dinâmicos
router.get("/courses", (req, res) => {
    const query = "SELECT DISTINCT course FROM class ORDER BY course;";
    db.query(query, (err, results) => {
        if (err) {
            // AQUI: Imprime o erro completo do banco de dados no console do servidor
            console.error("Erro ao buscar cursos:", err);
            return res.status(500).json({ error: "Erro no servidor" });
        }
        res.json(results);
    });
});

module.exports = router;