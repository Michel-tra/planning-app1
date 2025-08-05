const express = require('express');
const {
    getAllEmployes,
    addEmploye,
    updateEmploye,
    deleteEmploye
} = require('../controllers/employeController'); // Vérifie bien le nom du fichier ici

module.exports = (db) => {
    const router = express.Router();

    // Récupérer tous les employés
    router.get('/', (req, res) => getAllEmployes(req, res, db));

    // Ajouter un employé
    router.post('/', (req, res) => addEmploye(req, res, db));

    // Mettre à jour un employé
    router.put('/:id', (req, res) => updateEmploye(req, res, db));

    // Supprimer un employé
    router.delete('/:id', (req, res) => deleteEmploye(req, res, db));

    return router;
};
