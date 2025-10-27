// controllers/accessController.js

const accessModel = require("../models/accessModel");

/**
 * 🔹 Retorna todos os usuários e suas permissões de acesso
 */
exports.getAllAccess = async (req, res) => {
  try {
    const data = await accessModel.getAllAccessWithUsers();

    if (!data || data.length === 0) {
      return res.status(404).send("Nenhuma permissão encontrada.");
    }

    console.log("Permissões carregadas com sucesso");
    return res.status(200).json(data);
  } catch (err) {
    console.error("Erro ao buscar permissões:", err);
    return res.status(500).send("Erro interno ao buscar permissões de acesso.");
  }
};

/**
 * 🔹 Atualiza as permissões de um usuário específico
 */
exports.updateAccess = async (req, res) => {
  try {
    const { id_user } = req.params;
    const permissions = req.body;

    // 🔸 Validação do ID do usuário
    if (!id_user || isNaN(id_user)) {
      return res.status(400).send("ID de usuário inválido.");
    }

    // 🔸 Validação das permissões
    if (!permissions || typeof permissions !== "object") {
      return res.status(400).send("Permissões inválidas ou ausentes.");
    }

    // 🔸 Atualiza as permissões no banco
    const result = await accessModel.updateUserAccess(id_user, permissions);

    if (!result || result.affectedRows === 0) {
      return res
        .status(404)
        .send("Usuário não encontrado ou sem alterações a serem feitas.");
    }

    console.log(`Permissões do usuário ${id_user} atualizadas com sucesso`);
    return res
      .status(200)
      .json({ mensagem: "Permissões atualizadas com sucesso!" });
  } catch (err) {
    console.error("Erro ao atualizar permissões:", err);
    return res.status(500).send("Erro interno ao atualizar permissões.");
  }
};
