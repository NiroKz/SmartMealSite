const User = require("../models/userModel");

exports.getProfile = async (req, res) => {
  try {
    const id = req.query.id; // vem do front

    const user = await User.findUserById(id);

    if (!user) {
      return res.status(404).json({ erro: "Usuário não encontrado." });
    }

    return res.json(user);

  } catch (err) {
    console.error("Erro ao buscar perfil:", err);
    return res.status(500).json({ erro: "Erro no servidor." });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const id = req.query.id;
    const { user_name, email, phone } = req.body;

    await User.updateUser(id, user_name, email, phone);

    return res.json({ msg: "Perfil atualizado com sucesso!" });

  } catch (err) {
    console.error("Erro ao atualizar perfil:", err);
    return res.status(500).json({ erro: "Erro no servidor." });
  }
};
