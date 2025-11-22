const menuModel = require("../models/menuModel");

module.exports = {
  fetchMealTypes: async (req, res) => {
    try {
      const types = await menuModel.getMealTypes();
      res.json(types);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao buscar tipos de refeição" });
    }
  },

  registerMenu: async (req, res) => {
    try {
      await menuModel.insertMenu(req.body);
      //res.json({ message: "Cardápio registrado com sucesso!" });
    } catch (err) {
      console.error(err);
      //res.status(500).json({ error: "Erro ao registrar cardápio" });
    }
  },

  fetchMenuWeek: async (req, res) => {
    try {
      const week = await menuModel.getMenuWeek();
      res.json(week);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erro ao buscar cardápio semanal" });
    }
  },
};
