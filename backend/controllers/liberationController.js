const { createLiberation } = require("../models/liberationModel");

const handleLiberation = async (req, res) => {
  console.log("Received liberation request body:", req.body);
  try {
    const { rm, lunch, dinner, justification, option, repetir } = req.body;

    if (!rm || !justification || (!lunch && !dinner)) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const liberations = [];

    if (option === "temporary") {
      if (lunch) liberations.push({ date: lunch, type: "almoço" });
      if (dinner) liberations.push({ date: dinner, type: "jantar" });
    } else {
      const today = new Date().toISOString().split("T")[0];
      liberations.push({ date: today, type: "almoço" });
      liberations.push({ date: today, type: "jantar" });
    }

    for (const item of liberations) {
      const datetime = new Date(item.date);
      await createLiberation(rm, datetime, justification, item.type, option, repetir);
    }

    res.status(200).json({ message: "Liberation successfully created" });
  } catch (err) {
    console.error("Error in handleLiberation:", err);
    res.status(500).json({ error: "Server error", details: err.message || err });
  }
};

module.exports = { handleLiberation };