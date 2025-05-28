const express = require('express');
const router = express.Router();
const utilisateurController = require('../controllers/utilisateurController');

<<<<<<< HEAD
// ✅ Spécifiques d'abord
router.put('/:id/status', utilisateurController.toggleStatus);
router.put('/:id/role', utilisateurController.changerRole);

// Routes générales ensuite
router.get('/', utilisateurController.getAllUtilisateurs);
router.get('/manager/employes', utilisateurController.getAllUtilisateurs);
router.post('/', utilisateurController.ajouterUtilisateur);
router.put('/:id', utilisateurController.modifierUtilisateur);
router.delete('/:id', utilisateurController.supprimerUtilisateur);
router.get('/:id', utilisateurController.getUtilisateurById);

=======
// Routes utilisateur avec logique dans le contrôleur
router.get('/', utilisateurController.getAllUtilisateurs);
router.post('/', utilisateurController.ajouterUtilisateur);
router.put('/:id', utilisateurController.modifierUtilisateur);
router.delete('/:id', utilisateurController.supprimerUtilisateur);
>>>>>>> 93f5a34d (PROJETTUTORER)

module.exports = router;
