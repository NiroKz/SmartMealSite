const express = require("express");
const router = express.Router();
const db = require("../config/db");
const filterController = require("../controllers/filterController");

// Filtro de alunos
router.get("/students", filterController.getFilteredStudents);

// Cursos dinâmicos
router.get("/courses", async (req, res) => {
  try {
    const query = "SELECT DISTINCT course FROM class ORDER BY course;";
    const [results] = await db.execute(query);
    res.json(results);
  } catch (err) {
    console.error("Erro ao buscar cursos:", err);
    res.status(500).json({ error: "Erro no servidor" });
  }
});

module.exports = router;
