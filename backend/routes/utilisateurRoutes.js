const express = require('express');
const router = express.Router();
const utilisateurController = require('../controllers/utilisateurController');

// Routes utilisateur
router.get('/', utilisateurController.getAllUtilisateurs);
router.post('/', utilisateurController.ajouterUtilisateur);
router.put('/:id', utilisateurController.modifierUtilisateur);
router.delete('/:id', utilisateurController.supprimerUtilisateur);
router.get('/manager/employes', utilisateurController.getAllUtilisateurs);

// ✅ Bonnes routes pour status et rôle :
router.put('/:id/status', utilisateurController.toggleStatus);
router.put('/:id/role', utilisateurController.changerRole);

module.exports = router;
