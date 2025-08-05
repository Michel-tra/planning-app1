const express = require('express');
const router = express.Router();
const planningController = require('../controllers/planningController');

router.get('/', planningController.getAll);        // Lire tous les plannings
router.post('/', planningController.create);       // Créer un planning
router.put('/:id', planningController.update);     // Modifier un planning
router.delete('/:id', planningController.remove);  // Supprimer un planning
router.get('/personnel/:id', planningController.getPlanningPersonnel)


module.exports = router;


// Accès au planning personnel


