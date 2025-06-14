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
            'INSERT INTO demandes_conge (utilisateur_id, date_debut, date_fin, commentaire, statut) VALUES (?, ?, ?, ?, ?)',
            [utilisateur_id, date_debut, date_fin, motif, 'en_attente']
        );
        res.status(201).json({ id: result.insertId });
    } catch (err) {
        console.error('Erreur lors de la création de la demande de congé:', err.message, err.stack);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};
// Récupérer toutes les demandes pour tous les employés
exports.getToutesLesDemandes = async (req, res) => {
    const db = req.app.get('db');
    try {
        const [rows] = await db.execute(
            `SELECT dc.*, u.nom
             FROM demandes_conge dc
             JOIN utilisateurs u ON dc.utilisateur_id = u.id
             ORDER BY dc.date_debut DESC`
        );
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Accepter ou refuser une demande
exports.updateStatut = async (req, res) => {
    const { id } = req.params;
    const { statut, commentaire } = req.body;
    const db = req.app.get('db');
    try {
        await db.execute(
            `UPDATE demandes_conge SET statut = ?, commentaire = ? WHERE id = ?`,
            [statut, commentaire, id]
        );
        res.json({ message: 'Statut mis à jour' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
// Statistiques d'absences par employé (total de jours d'absence validés)
exports.getStatsAbsences = async (req, res) => {
    const db = req.app.get('db');
    try {
        const [rows] = await db.execute(
            `SELECT 
                u.nom AS nom_utilisateur,
                SUM(DATEDIFF(dc.date_fin, dc.date_debut) + 1) AS total_jours
             FROM demandes_conge dc
             JOIN utilisateurs u ON dc.utilisateur_id = u.id
             WHERE dc.statut = 'accepte'
             GROUP BY dc.utilisateur_id
             ORDER BY total_jours DESC`
        );
        res.json(rows);
    } catch (err) {
        console.error('Erreur lors du calcul des statistiques d’absences :', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


