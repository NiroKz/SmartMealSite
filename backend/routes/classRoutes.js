// routes/classRoutes.js

const express = require("express");
const router = express.Router();
const ClassController = require("../controllers/classController");

// Rota POST para cadastrar turmas
router.post("/register", ClassController.registerClass);
router.get("/list", ClassController.listClasses);
router.get("/get/:id", ClassController.getClassById);
router.put("/update/:id", ClassController.updateClass);
router.delete("/delete/:id", ClassController.deleteClass);

module.exports = router;
