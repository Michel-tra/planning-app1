const express = require('express');
const router = express.Router();
const utilisateurController = require('../controllers/utilisateurController');

// Routes utilisateur avec logique dans le contrôleur
router.get('/', utilisateurController.getAllUtilisateurs);
router.post('/', utilisateurController.ajouterUtilisateur);
router.put('/:id', utilisateurController.modifierUtilisateur);
router.delete('/:id', utilisateurController.supprimerUtilisateur);

module.exports = router;
