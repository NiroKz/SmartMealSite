const express = require("express");
const router = express.Router();
const { submitFeedback, getAllFeedbacks } = require("../controllers/feedbackController");

router.post("/submitFeedback", submitFeedback);
router.get("/getAllFeedbacks", getAllFeedbacks);

module.exports = router;
