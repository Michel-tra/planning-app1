const express = require('express');
const {
    getAllEmployes,
    addEmploye,
    updateEmploye,
    deleteEmploye
} = require('../controllers/employeController');

const router = express.Router();

// Récupérer tous les employés
router.get('/', getAllEmployes);

// Ajouter un employé
router.post('/', addEmploye);

// Mettre à jour un employé
router.put('/:id', updateEmploye);

// Supprimer un employé
router.delete('/:id', deleteEmploye);

module.exports = router;
