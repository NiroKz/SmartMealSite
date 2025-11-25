const ClassModel = require("../models/classModel");

async function registerClass(req, res) {
  try {
    const { course, period, grade } = req.body;

    await ClassModel.createClass(course, period, grade);
    return res.status(201).json({ message: "Turma criada com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erro ao criar turma." });
  }
}

async function listClasses(req, res) {
  const result = await ClassModel.getAllClasses();
  res.json(result);
}

async function getClassById(req, res) {
  const result = await ClassModel.getClassById(req.params.id);
  res.json(result);
}

async function updateClass(req, res) {
  const { course, period, grade } = req.body;

  await ClassModel.updateClass(
    req.params.id,
    course,
    period,
    grade
  );

  res.json({ message: "Turma atualizada com sucesso!" });
}

async function deleteClass(req, res) {
  try {
    const id = req.params.id;

    await ClassModel.deleteClass(id);

    res.json({ message: "Turma excluída com sucesso!" });
  } catch (error) {
    console.error("Erro ao excluir turma:", error);

    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(400).json({
        message:
          "Não é possível excluir esta turma porque existem alunos cadastrados nela.",
      });
    }

    res.status(500).json({ message: "Erro no servidor." });
  }
}

module.exports = {
  registerClass,
  listClasses,
  getClassById,
  updateClass,
  deleteClass,
};
