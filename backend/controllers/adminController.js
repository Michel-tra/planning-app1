// controllers/adminController.js

exports.getAdminStats = async (req, res) => {
    const db = req.app.get('db');

    try {
        const [[{ totalUtilisateurs }]] = await db.execute(
            'SELECT COUNT(*) AS totalUtilisateurs FROM utilisateurs'
        );

        const [[{ connectes }]] = await db.execute(
            'SELECT COUNT(*) AS connectes FROM utilisateurs WHERE est_connecte = 1'
        );

        const [repartition] = await db.execute(
            `SELECT role, COUNT(*) AS total FROM utilisateurs GROUP BY role`
        );

        const [[{ congesEnAttente }]] = await db.execute(
            "SELECT COUNT(*) AS congesEnAttente FROM demandes_conge WHERE statut = 'en_attente'"
        );

        const [[{ pointagesAujourdhui }]] = await db.execute(
            "SELECT COUNT(*) AS pointagesAujourdhui FROM pointages WHERE DATE(horodatage) = CURDATE()"
        );

        res.json({
            totalUtilisateurs,
            connectes,
            repartition,
            congesEnAttente,
            pointagesAujourdhui
        });
    } catch (error) {
        console.error('Erreur admin stats:', error);
        res.status(500).json({ message: "Erreur lors de la récupération des statistiques." });
    }
};

// ✅ Nouvelle méthode : Activité récente (logs)
exports.getRecentLogs = async (req, res) => {
    const db = req.app.get('db');

    try {
        const [logs] = await db.execute(`
            SELECT ja.*, u.nom, u.prenom, u.role 
            FROM journal_activite ja
            JOIN utilisateurs u ON ja.utilisateur_id = u.id
            ORDER BY ja.date_action DESC
            LIMIT 10
        `);
        res.json(logs);
    } catch (error) {
        console.error("Erreur récupération journal activité :", error);
        res.status(500).json({ message: "Erreur serveur lors de la récupération du journal." });
    }
};

// controllers/adminController.js


