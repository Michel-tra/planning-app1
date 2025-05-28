// routes/pointageRoutes.js
const express = require('express');
const router = express.Router();
const pointageController = require('../controllers/pointageController');

// ✅ Chaque handler doit être une fonction
router.get('/', pointageController.getPointages);
router.post('/', pointageController.ajouterPointage);
router.get('/export/pdf', pointageController.exportPointagesPDF);

module.exports = router;
