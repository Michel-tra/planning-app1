const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();


module.exports = (db) => {

    // Route pour la connexion
    // Utilisation de la méthode POST pour la connexion
    router.post('/', (req, res) => authController.login(req, res, db));


    return router;
};
