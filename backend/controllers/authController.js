exports.login = async (req, res, db) => {
    const { email, password } = req.body;

    try {
        const [rows] = await db.execute('SELECT * FROM utilisateurs WHERE email = ?', [email]);
        const user = rows[0];

        if (!user || user.mot_de_passe !== password) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }

        res.json({ user });
    } catch (error) {
        console.error('Erreur login:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
