const express = require('express');
const router = express.Router();
const { registerProduction, getProductionByDate } = require('../controllers/productionController');

router.post('/', registerProduction);

router.get('/', getProductionByDate);

module.exports = router;
