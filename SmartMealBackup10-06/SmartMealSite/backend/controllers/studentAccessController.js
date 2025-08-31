const { fetchStudentAccessDataToday } = require("../models/studentAccessModel");

const getTodayStudentAccessData = async (req, res) => {
  try {
    const data = await fetchStudentAccessDataToday();
    res.json(data);
  } catch (error) {
    console.error("Error in getTodayStudentAccessData:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getTodayStudentAccessData,
};