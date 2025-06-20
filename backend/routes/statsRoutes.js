const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');

// Routes pour les statistiques
router.get('/manager', statsController.getManagerStats);
router.get('/absences', statsController.getResumeAbsences);
router.get('/absences-par-user', statsController.getAbsencesParUtilisateur);
router.get('/absences-par-mois', statsController.getAbsencesParMois);
router.get('/retards-par-utilisateur', statsController.getRetardsParUtilisateur);
router.get('/absences-par-mois-utilisateur', statsController.getAbsencesParMoisEtUtilisateur);

router.get('/absences-utilisateur/:id', statsController.getTauxAbsenceUtilisateur);
router.get('/historique-arrivees/:id', statsController.getHistoriqueArrivees);
<<<<<<< HEAD
router.get('/export/absences', statsController.exportAbsencesPDF);
console.log("✅ statsRoutes chargé");
=======
>>>>>>> 24d514b8 (20/06/2025)

router.get('/absences-utilisateurs', statsController.getAbsencesParUtilisateur);



module.exports = router;
