const express = require('express');
<<<<<<< HEAD
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.post('/logout', authController.logout); // ✅ AJOUT DE CETTE ROUTE

module.exports = router;
=======
const authController = require('../controllers/authController');
const router = express.Router();


module.exports = (db) => {

    // Route pour la connexion
    // Utilisation de la méthode POST pour la connexion
    router.post('/', (req, res) => authController.login(req, res, db));


    return router;
};
>>>>>>> 93f5a34d (PROJETTUTORER)
