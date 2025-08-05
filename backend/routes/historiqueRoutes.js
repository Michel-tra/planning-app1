// routes/historiqueRoutes.js

const express = require('express');
const {
    getHistoriquePointages,
    getHistoriquePlannings,
    getHistoriqueConges
} = require('../controllers/historiqueController');

module.exports = (db) => {
    const router = express.Router();

    router.get('/pointages/:utilisateurId', (req, res) =>
        getHistoriquePointages(req, res, db)
    );
    router.get('/plannings/:utilisateurId', (req, res) =>
        getHistoriquePlannings(req, res, db)
    );
    router.get('/conges/:utilisateurId', (req, res) =>
        getHistoriqueConges(req, res, db)
    );

    return router;
};
