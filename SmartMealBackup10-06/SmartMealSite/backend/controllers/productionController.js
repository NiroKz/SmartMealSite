const { insertProduction } = require('../models/productionModel');

// Função para obter a data de hoje no formato "YYYY-MM-DD"
function getCurrentDateFormatted() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

const registerProduction = async (req, res) => {
  try {
    // Validação simples (você pode usar um middleware depois se quiser algo mais robusto)
    const { quantityProduced, mealType, shift, leftovers, notes } = req.body;
    if (!quantityProduced || !mealType || !shift) {
      return res.status(400).json({ message: 'Required fields are missing.' });
    }

    const productionData = {
      mealId: req.body.mealId || 1,  // Fixo ou determinado por outra lógica
      productionDate: getCurrentDateFormatted(),  // Data formatada
      quantityProduced,
      mealType,
      shift,
      leftovers: leftovers || 0,  // Padrão se vazio
      notes: notes || ''
    };

    await insertProduction(productionData);
    //res.status(201).json({ message: 'Production registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = { registerProduction };
