const express = require('express');
const {
    getAllEmployes,
    addEmploye,
    updateEmploye,
    deleteEmploye
<<<<<<< HEAD
} = require('../controllers/employeController'); // Vérifie bien le nom du fichier ici
=======
} = require('../controllers/employeController');
>>>>>>> 93f5a34d (PROJETTUTORER)

module.exports = (db) => {
    const router = express.Router();

<<<<<<< HEAD
    // Récupérer tous les employés
    router.get('/', (req, res) => getAllEmployes(req, res, db));

    // Ajouter un employé
    router.post('/', (req, res) => addEmploye(req, res, db));

    // Mettre à jour un employé
    router.put('/:id', (req, res) => updateEmploye(req, res, db));

    // Supprimer un employé
    router.delete('/:id', (req, res) => deleteEmploye(req, res, db));
=======
    router.get('/', async (req, res) => {
        await getAllEmployes(req, res, db);
    });

    router.post('/', async (req, res) => {
        await addEmploye(req, res, db);
    });

    router.put('/:id', async (req, res) => {
        await updateEmploye(req, res, db);
    });

    router.delete('/:id', async (req, res) => {
        await deleteEmploye(req, res, db);
    });
>>>>>>> 93f5a34d (PROJETTUTORER)

    return router;
};
