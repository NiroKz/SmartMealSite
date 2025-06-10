const express = require('express');
const router = express.Router();
const { registerProduction } = require('../controllers/productionController');

router.post('/', registerProduction);

module.exports = router;
