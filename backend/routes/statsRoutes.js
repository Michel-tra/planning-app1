const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

// Routes pour les statistiques Manager & Admin
router.get('/manager', statsController.getManagerStats);
router.get('/absences', statsController.getResumeAbsences);
router.get('/absences-par-user', statsController.getAbsencesParUtilisateur);
router.get('/absences-par-mois', statsController.getAbsencesParMois);
router.get('/retards-par-utilisateur', statsController.getRetardsParUtilisateur);
router.get('/absences-par-mois-utilisateur', statsController.getAbsencesParMoisEtUtilisateur);

// Routes individuelles par utilisateur
router.get('/absences-utilisateur/:id', statsController.getTauxAbsenceUtilisateur);
router.get('/historique-arrivees/:id', statsController.getHistoriqueArrivees);

// Export PDF des absences
router.get('/export/absences', statsController.exportAbsencesPDF);

console.log("✅ statsRoutes chargé");

module.exports = router;
