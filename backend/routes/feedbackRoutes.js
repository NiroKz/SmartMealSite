const express = require('express');
const router = express.Router();
const { submitFeedback, getAllFeedbacks } = require('../controllers/feedbackController');

// Rota para enviar feedback
router.post('/submitFeedback', submitFeedback);

// Rota para listar feedbacks (usada futuramente)
router.get('/getAllFeedbacks', getAllFeedbacks);

module.exports = router;
