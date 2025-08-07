const { enregistrerActivite } = require('../utils/logAction');
const pool = require('../config/db');

// ✅ Connexion de l'utilisateur
exports.login = async (req, res) => {
    const { email, password } = req.body;
    let connection;

    try {
        connection = await pool.getConnection();

        const [rows] = await connection.execute(
            'SELECT * FROM utilisateurs WHERE email = ?',
            [email]
        );


        const user = rows[0];

        if (!user || user.mot_de_passe !== password) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        if (user.actif === 0) {
            await enregistrerActivite(connection, user.id, 'Tentative de connexion - compte désactivé');
            return res.status(403).json({ message: 'Compte désactivé. Veuillez contacter un administrateur.' });
        }

        // ✅ Mise à jour de la connexion
        await connection.execute(
            'UPDATE utilisateurs SET est_connecte = 1, dernier_login = NOW() WHERE id = ?',
            [user.id]
        );

        await enregistrerActivite(connection, user.id, 'Connexion réussie');

        res.json({ user });

    } catch (error) {
        console.error('Erreur login:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    } finally {
        if (connection) connection.release();
    }
};

// ✅ Déconnexion de l'utilisateur
exports.logout = async (req, res) => {
    const { utilisateurId } = req.body;
    let connection;

    try {
        connection = await pool.getConnection();

        await connection.execute(
            'UPDATE utilisateurs SET est_connecte = 0 WHERE id = ?',
            [utilisateurId]
        );

        await enregistrerActivite(connection, utilisateurId, 'Déconnexion effectuée');

        res.json({ message: "Déconnexion réussie" });

    } catch (err) {
        console.error("Erreur lors de la déconnexion :", err);
        res.status(500).json({ message: "Erreur serveur" });
    } finally {
        if (connection) connection.release();
    }
};
