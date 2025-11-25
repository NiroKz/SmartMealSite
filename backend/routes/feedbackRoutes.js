const express = require("express");
const router = express.Router();
const { submitFeedback, getAllFeedbacks, getFeedbacksPaginated } = require("../controllers/feedbackController");

router.post("/submitFeedback", submitFeedback);
router.get("/getAllFeedbacks", getAllFeedbacks);
router.get("/getPaginated", getFeedbacksPaginated);

module.exports = router;
