const express = require('express');
const router = express.Router();
const { handleLiberation } = require('../controllers/liberationController');

router.post('/', handleLiberation);

module.exports = router;