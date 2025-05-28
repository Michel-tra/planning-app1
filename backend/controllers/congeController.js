// Récupérer les demandes d’un employé
exports.getDemandesParEmploye = async (req, res) => {
    const utilisateurId = req.params.id;
    const db = req.app.get('db');
    try {
        const [rows] = await db.execute(
            'SELECT * FROM demandes_conge WHERE utilisateur_id = ? ORDER BY date_debut DESC',
            [utilisateurId]
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

exports.creerDemande = async (req, res) => {
    const { utilisateur_id, date_debut, date_fin, motif } = req.body;
    const db = req.app.get('db');
    try {
        const [result] = await db.execute(
            'INSERT INTO demandes_conge (utilisateur_id, date_debut, date_fin, motif, statut) VALUES (?, ?, ?, ?, ?)',
            [utilisateur_id, date_debut, date_fin, motif, 'en attente']
        );
        res.status(201).json({ id: result.insertId });
    } catch (err) {
        console.error('Erreur lors de la création de la demande de congé', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
