const express = require('express');
const bcrypt = require('bcrypt');

module.exports = (db) => {
    const router = express.Router();

    // Route POST /api/login (en minuscules, plus standard)
    router.post('/', async (req, res) => {
        const { email, password } = req.body;

        console.log('📥 Reçu du frontend :', req.body);


        // Vérification des champs requis
        if (!email || !password) {
            return res.status(400).json({ message: 'Email et mot de passe requis' });
        }

        // Recherche de l'utilisateur par email
        db.query('SELECT * FROM utilisateurs WHERE email = ?', [email], async (err, results) => {
            if (err) {
                console.error('❌ Erreur MySQL :', err);
                return res.status(500).json({ message: 'Erreur serveur' });
            }

            if (results.length === 0) {
                return res.status(401).json({ message: 'Email incorrect ou non trouvé' });
            }

            const user = results[0];

            try {
                // Comparaison du mot de passe avec le hash
                const isMatch = await bcrypt.compare(password, user.mot_de_passe);
                if (!isMatch) {
                    return res.status(401).json({ message: 'Mot de passe incorrect' });
                }

                // On ne renvoie pas le mot de passe
                delete user.mot_de_passe;

                res.json({
                    message: 'Connexion réussie',
                    user: {
                        id: user.id,
                        nom: user.nom,
                        email: user.email,
                        role: user.role
                    }
                });
            } catch (err) {
                console.error('❌ Erreur comparaison mot de passe :', err);
                res.status(500).json({ message: 'Erreur serveur' });
            }
        });
    });

    return router;
};
