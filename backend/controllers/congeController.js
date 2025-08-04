// controllers/congeController.js
// Contrôleur de gestion des demandes de congés

// ✅ Récupérer les demandes d’un employé
exports.getDemandesParEmploye = async (req, res) => {
    const utilisateurId = req.params.id;
    const db = req.app.get('db');

    try {
        const connection = await db.getConnection();

        const [rows] = await connection.execute(
            'SELECT * FROM demandes_conge WHERE utilisateur_id = ? ORDER BY date_debut DESC',
            [utilisateurId]
        );

        connection.release();
        res.json(rows);

    } catch (err) {
        console.error("Erreur récupération demandes employé:", err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// ✅ Créer une nouvelle demande de congé
exports.creerDemande = async (req, res) => {
    const { utilisateur_id, date_debut, date_fin, motif } = req.body;
    const db = req.app.get('db');

    try {
        const connection = await db.getConnection();

        const [result] = await connection.execute(
            'INSERT INTO demandes_conge (utilisateur_id, date_debut, date_fin, commentaire, statut) VALUES (?, ?, ?, ?, ?)',
            [utilisateur_id, date_debut, date_fin, motif, 'en_attente']
        );

        connection.release();
        res.status(201).json({ id: result.insertId });

    } catch (err) {
        console.error('Erreur création demande congé:', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// ✅ Récupérer toutes les demandes pour tous les employés
exports.getToutesLesDemandes = async (req, res) => {
    const db = req.app.get('db');

    try {
        const connection = await db.getConnection();

        const [rows] = await connection.execute(`
            SELECT dc.*, u.nom, u.prenom
            FROM demandes_conge dc
            JOIN utilisateurs u ON dc.utilisateur_id = u.id
            ORDER BY dc.date_debut DESC
        `);

        connection.release();
        res.json(rows);

    } catch (err) {
        console.error("Erreur récupération de toutes les demandes:", err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// ✅ Accepter ou refuser une demande de congé
exports.updateStatut = async (req, res) => {
    const { id } = req.params;
    const { statut, commentaire } = req.body;
    const db = req.app.get('db');

    try {
        const connection = await db.getConnection();

        await connection.execute(
            'UPDATE demandes_conge SET statut = ?, commentaire = ? WHERE id = ?',
            [statut, commentaire, id]
        );

        connection.release();
        res.json({ message: 'Statut mis à jour' });

    } catch (err) {
        console.error("Erreur mise à jour du statut de la demande:", err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// ✅ Statistiques d'absences par employé (total jours d'absence validés)
exports.getStatsAbsences = async (req, res) => {
    const db = req.app.get('db');

    try {
        const connection = await db.getConnection();

        const [rows] = await connection.execute(`
            SELECT 
                CONCAT(u.nom, ' ', u.prenom) AS nom_utilisateur,
                SUM(DATEDIFF(dc.date_fin, dc.date_debut) + 1) AS total_jours
            FROM demandes_conge dc
            JOIN utilisateurs u ON dc.utilisateur_id = u.id
            WHERE dc.statut = 'accepte'
            GROUP BY dc.utilisateur_id
            ORDER BY total_jours DESC
        `);

        connection.release();
        res.json(rows);

    } catch (err) {
        console.error("Erreur stats absences:", err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
