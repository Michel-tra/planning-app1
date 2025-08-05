// controllers/historiqueController.js

exports.getHistoriquePointages = async (req, res) => {
    const db = req.app.get('db');
    const { utilisateurId } = req.params;
    try {
        const [rows] = await db.execute(
            'SELECT * FROM pointages WHERE utilisateur_id = ? ORDER BY horodatage DESC',
            [utilisateurId]
        );
        res.json(rows);
    } catch (error) {
        console.error('Erreur getHistoriquePointages :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.getHistoriquePlannings = async (req, res) => {
    const db = req.app.get('db');
    const { utilisateurId } = req.params;
    try {
        const [rows] = await db.execute(
            'SELECT * FROM plannings WHERE utilisateur_id = ? ORDER BY date DESC',
            [utilisateurId]
        );
        res.json(rows);
    } catch (error) {
        console.error('Erreur getHistoriquePlannings :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.getHistoriqueConges = async (req, res) => {
    const db = req.app.get('db');
    const { utilisateurId } = req.params;
    try {
        const [rows] = await db.execute(
            'SELECT * FROM demandes_conge WHERE utilisateur_id = ? ORDER BY date_debut DESC',
            [utilisateurId]
        );
        res.json(rows);
    } catch (error) {
        console.error('Erreur getHistoriqueConges :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
