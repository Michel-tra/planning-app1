const express = require('express');
const {
    getAllEmployes,
    addEmploye,
    updateEmploye,
    deleteEmploye
} = require('../controllers/employeController');

module.exports = (db) => {
    const router = express.Router();

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

    return router;
};
