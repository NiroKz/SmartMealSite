const { createLiberation } = require("../models/liberationModel");

async function handleLiberation(req, res) {
  try {
    console.log("Received liberation request body:", req.body);

    const { rm, lunch, dinner, justification, option, repeat } = req.body;

    const meals = [];
    if (lunch) meals.push({ type: "lunch", date: lunch });
    if (dinner) meals.push({ type: "dinner", date: dinner });

    if (meals.length === 0) {
      return res.status(400).json({ error: "Selecione pelo menos uma refeição" });
    }

    for (const meal of meals) {
      await createLiberation(
        rm,
        meal.date,       // usa a data que veio do form
        justification,
        meal.type,
        option,
        repeat
      );
    }

    return res.status(201).json({ message: "Exception release registered successfully!" });
  } catch (err) {
    console.error("Error in handleLiberation:", err);
    return res.status(500).json({ error: "Failed to register exception release" });
  }
}

module.exports = { handleLiberation };
