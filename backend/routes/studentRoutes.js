const express = require("express");
const router = express.Router();
const {
  registerStudent,
  getClasses,
  searchStudents,
  updateStudent,
  deleteStudent
} = require("../controllers/studentController");

router.post("/register", registerStudent);
router.get("/search", searchStudents);
router.put("/update/:id_student", updateStudent);
router.delete("/delete/:id_student", deleteStudent);

router.get("/classes", getClasses);

module.exports = router;
