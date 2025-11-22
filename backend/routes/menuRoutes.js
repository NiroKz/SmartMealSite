const express = require("express");
const router = express.Router();
const menuController = require("../controllers/menuController");

router.get("/meal-types", menuController.fetchMealTypes);
router.post("/register", menuController.registerMenu);
router.get("/week", menuController.fetchMenuWeek);

module.exports = router;
