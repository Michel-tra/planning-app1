<<<<<<< HEAD
=======
// routes/pointageRoutes.js
>>>>>>> 93f5a34d (PROJETTUTORER)
const express = require('express');
const router = express.Router();
const pointageController = require('../controllers/pointageController');

<<<<<<< HEAD
// Routes pointage
router.get('/', pointageController.getPointages);
router.post('/', pointageController.ajouterPointage);
router.get('/export/pdf', pointageController.exportPointagesPDF);
router.post('/pointeur', pointageController.pointerAvecBadge);
router.get('/filtre', pointageController.getPointagesAvecFiltre);

router.get('/resume-jour/:id', pointageController.resumeDuJour);
router.get('/historique/:id', pointageController.getHistoriquePointages);

=======
// ✅ Chaque handler doit être une fonction
router.get('/', pointageController.getPointages);
router.post('/', pointageController.ajouterPointage);
router.get('/export/pdf', pointageController.exportPointagesPDF);
>>>>>>> 93f5a34d (PROJETTUTORER)

module.exports = router;
