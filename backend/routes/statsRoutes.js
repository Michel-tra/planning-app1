const express = require('express');
const {
    getManagerStats,
    getAbsencesParMois,
    getAbsencesParUtilisateur,
    getResumeAbsences,
    getRetardsParUtilisateur,
    exportAbsencesPDF
} = require('../controllers/statsController');
console.log({
    getManagerStats,
    getAbsencesParMois,
    getAbsencesParUtilisateur,
    getResumeAbsences,
    getRetardsParUtilisateur,
    exportAbsencesPDF
});

const router = express.Router();

// Routes
router.get('/manager', getManagerStats);
router.get('/absences-par-mois', getAbsencesParMois);
router.get('/absences-par-user', getAbsencesParUtilisateur);
router.get('/resume-absences', getResumeAbsences);
router.get('/retards-par-user', getRetardsParUtilisateur);
router.get('/export-absences', exportAbsencesPDF);

module.exports = router;
