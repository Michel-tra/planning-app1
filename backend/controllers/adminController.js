// controllers/adminController.js
const { enregistrerActivite } = require('../utils/logAction');  // Si nécessaire

// 📊 Statistiques générales pour le tableau de bord admin
exports.getAdminStats = async (req, res) => {
    const db = req.app.get('db');

    try {
        const connection = await db.getConnection();

        const [[{ totalUtilisateurs }]] = await connection.execute(
            'SELECT COUNT(*) AS totalUtilisateurs FROM utilisateurs'
        );

        const [[{ connectes }]] = await connection.execute(
            'SELECT COUNT(*) AS connectes FROM utilisateurs WHERE est_connecte = 1'
        );

        const [repartition] = await connection.execute(
            'SELECT role, COUNT(*) AS total FROM utilisateurs GROUP BY role'
        );

        const [[{ congesEnAttente }]] = await connection.execute(
            "SELECT COUNT(*) AS congesEnAttente FROM demandes_conge WHERE statut = 'en_attente'"
        );

        const [[{ pointagesAujourdhui }]] = await connection.execute(
            "SELECT COUNT(*) AS pointagesAujourdhui FROM pointages WHERE DATE(horodatage) = CURDATE()"
        );

        connection.release();

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

// 📁 Journal d'activité : dernières actions enregistrées
exports.getRecentLogs = async (req, res) => {
    const db = req.app.get('db');

    try {
        const connection = await db.getConnection();

        const [logs] = await connection.execute(`
            SELECT ja.*, u.nom, u.prenom, u.role 
            FROM journal_activite ja
            JOIN utilisateurs u ON ja.utilisateur_id = u.id
            ORDER BY ja.date_action DESC
            LIMIT 10
        `);

        connection.release();

        res.json(logs);

    } catch (error) {
        console.error("Erreur récupération journal activité :", error);
        res.status(500).json({ message: "Erreur serveur lors de la récupération du journal." });
    }
};

// 📅 Congés acceptés par utilisateur et par mois pour une année donnée
exports.getCongesParUtilisateur = async (req, res) => {
    const db = req.app.get('db');
    const annee = req.query.annee || new Date().getFullYear();

    try {
        const connection = await db.getConnection();

        const [rows] = await connection.execute(`
            SELECT 
                u.nom,
                MONTH(dc.date_debut) AS mois,
                COUNT(*) AS total
            FROM demandes_conge dc
            JOIN utilisateurs u ON u.id = dc.utilisateur_id
            WHERE dc.statut = 'accepte' AND YEAR(dc.date_debut) = ?
            GROUP BY u.nom, mois
            ORDER BY mois
        `, [annee]);

        connection.release();

        const moisNoms = ['', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
            'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

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

// 🎉 Utilisateurs ayant droit à un congé (≥ 1 an d'ancienneté)
exports.getDroitCongesParAnciennete = async (req, res) => {
    const db = req.app.get('db');

    try {
        const connection = await db.getConnection();

        const [rows] = await connection.execute(`
            SELECT 
                id, nom, prenom, date_embauche,
                TIMESTAMPDIFF(YEAR, date_embauche, CURDATE()) AS anciennete
            FROM utilisateurs
            WHERE date_embauche IS NOT NULL
              AND TIMESTAMPDIFF(YEAR, date_embauche, CURDATE()) >= 1
        `);

        connection.release();

        res.json(rows);

    } catch (error) {
        console.error("Erreur droits congés :", error);
        res.status(500).json({ message: "Erreur récupération des droits à congé." });
    }
};

// 📈 Nombre total de congés acceptés par année
exports.getCongesParAnnee = async (req, res) => {
    const db = req.app.get('db');

    try {
        const connection = await db.getConnection();

        const [rows] = await connection.execute(`
            SELECT 
                YEAR(date_debut) AS annee, 
                COUNT(*) AS total
            FROM demandes_conge
            WHERE statut = 'accepte'
            GROUP BY annee
            ORDER BY annee ASC
        `);

        connection.release();

        res.json(rows);

    } catch (error) {
        console.error("Erreur récupération congés par année :", error);
        res.status(500).json({ message: "Erreur serveur lors du chargement des congés par année." });
    }
};

// 📊 Congés par utilisateur et par année
exports.getCongesParUtilisateurParAnnee = async (req, res) => {
    const db = req.app.get('db');

    try {
        const connection = await db.getConnection();

        const [rows] = await connection.execute(`
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

        connection.release();

        res.json(rows);

    } catch (error) {
        console.error("Erreur congés par utilisateur et année :", error);
        res.status(500).json({ message: "Erreur serveur lors de la récupération des congés par utilisateur." });
    }
};

// 🧮 Total de congés par utilisateur (filtrable par année)
exports.getTotalCongesParUtilisateur = async (req, res) => {
    const db = req.app.get('db');
    const annee = req.query.annee;

    try {
        const connection = await db.getConnection();

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
            ? await connection.execute(query, [annee])
            : await connection.execute(query);

        connection.release();

        res.json(rows);

    } catch (error) {
        console.error("Erreur congés totaux par utilisateur :", error);
        res.status(500).json({ message: "Erreur lors de la récupération." });
    }
};

// 🧑‍🤝‍🧑 Nombre de congés acceptés par bénéficiaire (année spécifique ou tous)
exports.getCongesParBeneficiaire = async (req, res) => {
    const db = req.app.get('db');
    const annee = req.query.annee;

    try {
        const connection = await db.getConnection();

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
            ? await connection.execute(query, [annee])
            : await connection.execute(query);

        connection.release();

        res.json(rows);

    } catch (error) {
        console.error("Erreur congés par bénéficiaire :", error);
        res.status(500).json({ message: "Erreur lors de la récupération des congés." });
    }
};
