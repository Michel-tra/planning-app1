const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');


// Route pour récupérer les statistiques du manager
router.get('/manager', statsController.getManagerStats);

module.exports = router;
