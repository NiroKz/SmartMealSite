const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/me", userController.getProfile);
router.put("/update", userController.updateProfile);


module.exports = router;
