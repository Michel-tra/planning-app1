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
exports.getCongesParUtilisateur = async (req, res) => {
    const db = req.app.get('db');
    const annee = req.query.annee || new Date().getFullYear();

    try {
        const [rows] = await db.execute(
            `
            SELECT 
                u.nom,
                MONTH(dc.date_debut) AS mois,
                COUNT(*) AS total
            FROM demandes_conge dc
            JOIN utilisateurs u ON u.id = dc.utilisateur_id
            WHERE dc.statut = 'accepte' AND YEAR(dc.date_debut) = ?
            GROUP BY u.nom, mois
            ORDER BY mois
            `,
            [annee]
        );

        // Transformer mois numériques → noms de mois + agréger si nécessaire
        const moisNoms = [
            '', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
            'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
        ];

        const result = rows.map(row => ({
            nom: row.nom,
            mois: moisNoms[row.mois],
            total: row.total
        }));

        res.json(result);
    } catch (error) {
        console.error("Erreur congés par utilisateur :", error);
        res.status(500).json({ message: "Erreur serveur lors du chargement des congés." });
    }
};

// ✅ API : utilisateurs ayant droit à un congé cette année par ancienneté
exports.getDroitCongesParAnciennete = async (req, res) => {
    const db = req.app.get('db');
    const annee = req.query.annee || new Date().getFullYear();

    try {
        const [rows] = await db.execute(`
            SELECT 
                id, nom, prenom, date_embauche,
                TIMESTAMPDIFF(YEAR, date_embauche, CURDATE()) AS anciennete
            FROM utilisateurs
            WHERE date_embauche IS NOT NULL
              AND TIMESTAMPDIFF(YEAR, date_embauche, CURDATE()) >= 1
        `);

        res.json(rows);
    } catch (error) {
        console.error("Erreur droits congés :", error);
        res.status(500).json({ message: "Erreur récupération des droits à congé." });
    }
};
// ✅ API : Total de congés accordés par année
exports.getCongesParAnnee = async (req, res) => {
    const db = req.app.get('db');

    try {
        const [rows] = await db.execute(`
            SELECT 
                YEAR(date_debut) AS annee, 
                COUNT(*) AS total
            FROM demandes_conge
            WHERE statut = 'accepte'
            GROUP BY annee
            ORDER BY annee ASC
        `);

        res.json(rows);
    } catch (error) {
        console.error("Erreur récupération congés par année :", error);
        res.status(500).json({ message: "Erreur serveur lors du chargement des congés par année." });
    }
};

exports.getCongesParUtilisateurParAnnee = async (req, res) => {
    const db = req.app.get('db');

    try {
        const [rows] = await db.execute(`
            SELECT 
                u.nom,
                YEAR(dc.date_debut) AS annee,
                COUNT(*) AS total
            FROM demandes_conge dc
            JOIN utilisateurs u ON u.id = dc.utilisateur_id
            WHERE dc.statut = 'accepte'
            GROUP BY u.nom, annee
            ORDER BY annee ASC
        `);

        res.json(rows);
    } catch (error) {
        console.error("Erreur congés par utilisateur et année :", error);
        res.status(500).json({ message: "Erreur serveur lors de la récupération des congés par utilisateur." });
    }
};

exports.getTotalCongesParUtilisateur = async (req, res) => {
    const db = req.app.get('db');
    const annee = req.query.annee;

    try {
        const query = `
            SELECT 
                CONCAT(u.nom, ' ', u.prenom) AS nom,
                COUNT(*) AS total
            FROM demandes_conge dc
            JOIN utilisateurs u ON u.id = dc.utilisateur_id
            WHERE dc.statut = 'accepte'
            ${annee ? 'AND YEAR(dc.date_debut) = ?' : ''}
            GROUP BY u.id
            HAVING total > 0
            ORDER BY total DESC
        `;

        const [rows] = annee
            ? await db.execute(query, [annee])
            : await db.execute(query);

        res.json(rows);
    } catch (error) {
        console.error("Erreur congés totaux par utilisateur :", error);
        res.status(500).json({ message: "Erreur lors de la récupération." });
    }
};
exports.getCongesParBeneficiaire = async (req, res) => {
    const db = req.app.get('db');
    const annee = req.query.annee;

    try {
        const query = `
            SELECT 
                CONCAT(u.nom, ' ', u.prenom) AS nom,
                COUNT(*) AS total
            FROM demandes_conge dc
            JOIN utilisateurs u ON u.id = dc.utilisateur_id
            WHERE dc.statut = 'accepte'
            ${annee && annee !== 'tous' ? 'AND YEAR(dc.date_debut) = ?' : ''}
            GROUP BY u.id
            HAVING total > 0
            ORDER BY total DESC
        `;

        const [rows] = annee && annee !== 'tous'
            ? await db.execute(query, [annee])
            : await db.execute(query);

        res.json(rows);
    } catch (error) {
        console.error("Erreur congés par bénéficiaire :", error);
        res.status(500).json({ message: "Erreur lors de la récupération des congés." });
    }
};






