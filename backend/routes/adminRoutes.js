const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/stats', adminController.getAdminStats);
router.get('/logs', adminController.getRecentLogs);
router.get('/stats/conges-par-utilisateur', adminController.getCongesParUtilisateur);
router.get('/stats/conges-anciennete', adminController.getDroitCongesParAnciennete);
router.get('/stats/conges-par-annee', adminController.getCongesParAnnee);
router.get('/stats/conges-utilisateur-par-annee', adminController.getCongesParUtilisateurParAnnee);
router.get('/stats/conges-par-beneficiaire', adminController.getTotalCongesParUtilisateur);


// 📊 Statistiques supplémentaires
router.get('/stats/conges-par-utilisateur', adminController.getCongesParUtilisateur);
router.get('/stats/conges-anciennete', adminController.getDroitCongesParAnciennete);
router.get('/stats/conges-par-annee', adminController.getCongesParAnnee);
router.get('/stats/conges-utilisateur-par-annee', adminController.getCongesParUtilisateurParAnnee);
router.get('/stats/conges-par-beneficiaire', adminController.getTotalCongesParUtilisateur);

module.exports = router;
