const express = require("express");
const router = express.Router();
const graphicController = require("../controllers/graphicController");

router.get("/studentsCurses", graphicController.studentsCurses);

module.exports = router;
