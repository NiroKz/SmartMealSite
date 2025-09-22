const db = require("../config/db");

function handleLiberation(req, res) {
  console.log("Received liberation request body:", req.body);

  const { rm, lunch, dinner, justification, option, repeat } = req.body;

  // 🔹 meal_type: pega o primeiro que não for null
  let meal_type = null;
  if (lunch) meal_type = "lunch";
  else if (dinner) meal_type = "dinner";

  // 🔹 repeat: converter boolean para yes/no
  const allow_repeat = repeat ? "yes" : "no";

  // 🔹 garantir datetime completo
  const date_time = new Date().toISOString().slice(0, 19).replace("T", " ");

  const query = `
    INSERT INTO release_exception
    (id_rm, meal_type, type_release, date_time, reason, allow_repeat)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  const values = [rm, meal_type, option, date_time, justification, allow_repeat];

  db.query(query, values, (err, results) => {
    if (err) {
      console.error("Error in handleLiberation:", err);
      return res.status(500).json({ error: "Failed to register exception release" });
    }
    res.json(results);

    res.status(201).json({ message: "Exception release registered successfully!" });
  });
}

module.exports = { handleLiberation };
