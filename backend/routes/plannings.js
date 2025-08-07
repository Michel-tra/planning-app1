const express = require('express');
const router = express.Router();
const planningController = require('../controllers/planningController');

// Lire tous les plannings
router.get('/', planningController.getAll);

// Créer un planning
router.post('/', planningController.create);

// Modifier un planning
router.put('/:id', planningController.update);

// Supprimer un planning
router.delete('/:id', planningController.remove);

// Accès au planning personnel
router.get('/personnel/:id', planningController.getPlanningPersonnel);

module.exports = router;
