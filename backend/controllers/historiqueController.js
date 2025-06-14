// controllers/historiqueController.js

const getHistoriquePointages = async (req, res, db) => {
    const { utilisateurId } = req.params;
    try {
        const [rows] = await db.query(
            'SELECT * FROM pointages WHERE utilisateur_id = ? ORDER BY horodatage DESC',
            [utilisateurId]
        );
        res.json(rows);
    } catch (error) {
        console.error('Erreur getHistoriquePointages :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const getHistoriquePlannings = async (req, res, db) => {
    const { utilisateurId } = req.params;
    try {
        const [rows] = await db.query(
            'SELECT * FROM plannings WHERE utilisateur_id = ? ORDER BY date DESC',
            [utilisateurId]
        );
        res.json(rows);
    } catch (error) {
        console.error('Erreur getHistoriquePlannings :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const getHistoriqueConges = async (req, res, db) => {
    const { utilisateurId } = req.params;
    try {
        const [rows] = await db.query(
            'SELECT * FROM demandes_conge WHERE utilisateur_id = ? ORDER BY date_debut DESC',
            [utilisateurId]
        );
        res.json(rows);
    } catch (error) {
        console.error('Erreur getHistoriqueConges :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

module.exports = {
    getHistoriquePointages,
    getHistoriquePlannings,
    getHistoriqueConges,
};
