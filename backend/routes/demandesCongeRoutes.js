const express = require('express');
const router = express.Router();
const congeController = require('../controllers/congeController');

// Exemple : /api/conges/employe/5
router.get('/employe/:id', congeController.getDemandesParEmploye);
router.post('/', congeController.creerDemande);
<<<<<<< HEAD
router.get('/manager/toutes', congeController.getToutesLesDemandes);
router.put('/manager/:id', congeController.updateStatut);
router.get('/absences/stats', congeController.getStatsAbsences);
router.get('/historique/:id', congeController.getDemandesParEmploye);


=======
>>>>>>> 93f5a34d (PROJETTUTORER)


module.exports = router;
