exports.login = async (req, res) => {
    const db = req.app.get('db'); // ← Récupération standard
    const { email, password } = req.body;

    try {
        const [rows] = await db.execute('SELECT * FROM utilisateurs WHERE email = ?', [email]);
        const user = rows[0];

        if (!user || user.mot_de_passe !== password) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        // Mise à jour de connexion
        await db.execute('UPDATE utilisateurs SET est_connecte = 1, dernier_login = NOW() WHERE id = ?', [user.id]);

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
        res.json({ message: "Déconnexion réussie" });
    } catch (err) {
        console.error("Erreur lors de la déconnexion :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
