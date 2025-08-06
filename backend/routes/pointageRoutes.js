const express = require('express');
const router = express.Router();
const pointageController = require('../controllers/pointageController');

// Routes pointage
router.get('/', pointageController.getPointages);
router.post('/', pointageController.ajouterPointage);
router.get('/export/pdf', pointageController.exportPointagesPDF);
router.post('/pointeur', pointageController.pointerAvecBadge);
router.get('/filtre', pointageController.getPointagesAvecFiltre);
router.get('/resume-jour/:id', pointageController.resumeDuJour);
router.get('/historique/:id', pointageController.getHistoriquePointages);

module.exports = router;
