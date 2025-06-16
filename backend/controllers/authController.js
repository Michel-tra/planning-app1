const { enregistrerActivite } = require('../utils/logAction'); // ✅ Import correct

exports.login = async (req, res) => {
    const db = req.app.get('db');
    const { email, password } = req.body;

    try {
        const [rows] = await db.execute('SELECT * FROM utilisateurs WHERE email = ?', [email]);
        const user = rows[0];

        if (!user || user.mot_de_passe !== password) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        // ✅ Mise à jour connexion
        await db.execute('UPDATE utilisateurs SET est_connecte = 1, dernier_login = NOW() WHERE id = ?', [user.id]);
        await enregistrerActivite(db, user.id, 'connexion');

        // ✅ Journalisation
        await enregistrerActivite(db, user.id, 'Connexion réussie');

        res.json({ user });
    } catch (error) {
        console.error('Erreur login:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.logout = async (req, res) => {
    const db = req.app.get('db');
    const { utilisateurId } = req.body;

    try {
        await db.execute('UPDATE utilisateurs SET est_connecte = 0 WHERE id = ?', [utilisateurId]);

        // ✅ Journalisation
        await enregistrerActivite(db, utilisateurId, 'Déconnexion effectuée');

        res.json({ message: "Déconnexion réussie" });
    } catch (err) {
        console.error("Erreur lors de la déconnexion :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
