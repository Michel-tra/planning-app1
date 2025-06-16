const express = require('express');
const router = express.Router();
const utilisateurController = require('../controllers/utilisateurController');

// ✅ Routes spécifiques d'abord (status & rôle)
router.put('/:id/status', utilisateurController.toggleStatus);
router.put('/:id/role', utilisateurController.changerRole);

// ✅ Routes générales ensuite
router.get('/', utilisateurController.getAllUtilisateurs);
router.get('/manager/employes', utilisateurController.getAllUtilisateurs);
router.post('/', utilisateurController.ajouterUtilisateur);
router.put('/:id', utilisateurController.modifierUtilisateur);
router.delete('/:id', utilisateurController.supprimerUtilisateur);
router.get('/:id', utilisateurController.getUtilisateurById);

module.exports = router;
