const express = require('express');
const router = express.Router();
const congeController = require('../controllers/congeController');

// Exemple : /api/conges/employe/5
router.get('/employe/:id', congeController.getDemandesParEmploye);
router.post('/', congeController.creerDemande);
router.get('/manager/toutes', congeController.getToutesLesDemandes);
router.put('/manager/:id', congeController.updateStatut);



module.exports = router;
