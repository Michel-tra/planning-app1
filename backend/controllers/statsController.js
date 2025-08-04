const PDFDocument = require('pdfkit');

// ================================
// Partie : Stats globales manager
// ================================

exports.getManagerStats = async (req, res) => {
    const db = req.app.get('db');
    const managerId = req.query.managerId;

    try {
        // 1. Utilisateurs connectés
        const [connectes] = await db.execute(`
            SELECT id, nom, prenom, role 
            FROM utilisateurs 
            WHERE est_connecte = 1
        `);

        const nbConnectes = connectes.length;

        // 2. Plannings de la semaine
        const [[{ plannings }]] = await db.execute(`
            SELECT COUNT(*) AS plannings 
            FROM plannings
            WHERE WEEK(DATE(date), 1) = WEEK(CURDATE(), 1)
              AND YEAR(date) = YEAR(CURDATE())
        `);

        // 3. Congés en attente
        const [[{ conges }]] = await db.execute(`
            SELECT COUNT(*) AS conges 
            FROM demandes_conge 
            WHERE statut = 'en_attente'
        `);

        // 4. Absents aujourd’hui
        const [absents] = await db.execute(`
            SELECT u.id 
            FROM utilisateurs u
            LEFT JOIN (
                SELECT DISTINCT utilisateur_id 
                FROM pointages 
                WHERE DATE(horodatage) = CURDATE()
            ) p ON u.id = p.utilisateur_id
            LEFT JOIN demandes_conge dc 
                ON dc.utilisateur_id = u.id 
               AND dc.statut = 'accepte' 
               AND CURDATE() BETWEEN dc.date_debut AND dc.date_fin
            WHERE p.utilisateur_id IS NULL 
              AND dc.id IS NULL 
              AND LOWER(u.jour_repos) != LOWER(DAYNAME(CURDATE()))
        `);

        const absencesJour = absents.length;

        // 5. Retards aujourd’hui
        const [retardRows] = await db.execute(`
            SELECT 
                u.id, 
                MIN(TIME(p.horodatage)) AS arrivee, 
                pl.heure_debut
            FROM utilisateurs u
            JOIN pointages p ON u.id = p.utilisateur_id AND DATE(p.horodatage) = CURDATE()
            LEFT JOIN plannings pl ON pl.utilisateur_id = u.id AND DATE(pl.date) = CURDATE()
            GROUP BY u.id
        `);

        let retardsJour = 0;
        retardRows.forEach(user => {
            if (user.heure_debut && user.arrivee > user.heure_debut) {
                retardsJour++;
            }
        });

        // 6. Pointage du manager aujourd’hui
        const [[{ aPointe }]] = await db.execute(`
            SELECT COUNT(*) AS aPointe 
            FROM pointages 
            WHERE utilisateur_id = ? 
              AND DATE(horodatage) = CURDATE()
        `, [managerId]);

        const etatPointageManager = aPointe > 0 ? 'Présent' : 'Absent';

        // 7. Taux de pointage global
        const [attendus] = await db.execute(`
            SELECT u.id 
            FROM utilisateurs u
            LEFT JOIN demandes_conge dc 
                ON dc.utilisateur_id = u.id 
               AND dc.statut = 'accepte'
               AND CURDATE() BETWEEN dc.date_debut AND dc.date_fin
            WHERE dc.id IS NULL 
              AND LOWER(u.jour_repos) != LOWER(DAYNAME(CURDATE()))
        `);

        const nbAttendus = attendus.length;

        const [pointes] = await db.execute(`
            SELECT DISTINCT utilisateur_id 
            FROM pointages 
            WHERE DATE(horodatage) = CURDATE()
        `);

        const nbPointes = pointes.length;
        const tauxPointage = nbAttendus > 0 ? `${Math.round((nbPointes / nbAttendus) * 100)}%` : '0%';

        res.json({
            employesActifs: nbConnectes,
            utilisateursConnectes: connectes,
            planningsSemaine: plannings,
            congesEnAttente: conges,
            absentsAujourdhui: absencesJour,
            retardsAujourdhui: retardsJour,
            etatPointageManager,
            tauxDePointage: tauxPointage
        });

    } catch (err) {
        console.error("Erreur stats manager :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// ================================
// Partie : Stats Absences (par mois, utilisateur, résumé)
// ================================

exports.getAbsencesParMois = async (req, res) => {
    const db = req.app.get('db');
    const annee = req.query.annee || new Date().getFullYear();

    try {
        const [rows] = await db.execute(`
            SELECT MONTH(date_debut) AS mois, COUNT(*) AS total
            FROM demandes_conge
            WHERE statut = 'accepte' AND YEAR(date_debut) = ?
            GROUP BY mois
            ORDER BY mois
        `, [annee]);

        const moisLabels = ['', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
            'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

        const formatted = rows.map(row => ({
            mois: moisLabels[row.mois],
            total: row.total
        }));

        res.json(formatted);
    } catch (error) {
        console.error("Erreur récupération absences :", error);
        res.status(500).json({ message: "Erreur serveur absences." });
    }
};

exports.getAbsencesParUtilisateur = async (req, res) => {
    const db = req.app.get('db');

    try {
        const [rows] = await db.execute(`
            SELECT 
                u.id, u.nom, u.prenom,
                COUNT(DISTINCT d.date) AS total_jours,
                COUNT(DISTINCT d.date) - COUNT(DISTINCT p.date) AS absences
            FROM utilisateurs u
            CROSS JOIN (
                SELECT CURDATE() - INTERVAL a DAY AS date
                FROM (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                      UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
                      UNION ALL SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 13 UNION ALL SELECT 14
                      UNION ALL SELECT 15 UNION ALL SELECT 16 UNION ALL SELECT 17 UNION ALL SELECT 18 UNION ALL SELECT 19
                      UNION ALL SELECT 20 UNION ALL SELECT 21 UNION ALL SELECT 22 UNION ALL SELECT 23 UNION ALL SELECT 24
                      UNION ALL SELECT 25 UNION ALL SELECT 26 UNION ALL SELECT 27 UNION ALL SELECT 28 UNION ALL SELECT 29) AS days
            ) d
            LEFT JOIN (
                SELECT utilisateur_id, DATE(horodatage) AS date
                FROM pointages
            ) p ON p.utilisateur_id = u.id AND p.date = d.date
            GROUP BY u.id
        `);

        res.json(rows);
    } catch (err) {
        console.error("Erreur stats utilisateurs :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

exports.getAbsencesParMoisEtUtilisateur = async (req, res) => {
    const db = req.app.get('db');
    const annee = req.query.annee || new Date().getFullYear();

    try {
        const [rows] = await db.execute(`
            SELECT u.nom, u.prenom, MONTH(dc.date_debut) AS mois, COUNT(*) AS total
            FROM demandes_conge dc
            JOIN utilisateurs u ON u.id = dc.utilisateur_id
            WHERE dc.statut = 'accepte' AND YEAR(dc.date_debut) = ?
            GROUP BY u.id, mois
            ORDER BY mois, total DESC
        `, [annee]);

        const moisLabels = ['', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
            'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];

        const formatted = rows.map(row => ({
            mois: moisLabels[row.mois],
            beneficiaire: `${row.prenom} ${row.nom}`,
            total: row.total
        }));

        res.json(formatted);
    } catch (err) {
        console.error("Erreur congés par mois et utilisateur :", err);
        res.status(500).json({ message: "Erreur serveur." });
    }
};

exports.getRetardsParUtilisateur = async (req, res) => {
    const db = req.app.get('db');
    try {
        // Ton code ici pour calculer les retards par utilisateur
        res.json([]); // temporaire
    } catch (err) {
        console.error("Erreur getRetardsParUtilisateur :", err);
        res.status(500).json({ message: "Erreur serveur." });
    }
};

exports.getTauxAbsenceUtilisateur = async (req, res) => {
    const db = req.app.get('db');
    const { id } = req.params;
    try {
        // Ton code ici pour le taux d'absence d'un utilisateur spécifique
        res.json({ taux: "0%" }); // temporaire
    } catch (err) {
        console.error("Erreur getTauxAbsenceUtilisateur :", err);
        res.status(500).json({ message: "Erreur serveur." });
    }
};

exports.getHistoriqueArrivees = async (req, res) => {
    const db = req.app.get('db');
    const { id } = req.params;
    try {
        // Ton code ici pour l'historique des arrivées d'un utilisateur
        res.json([]); // temporaire
    } catch (err) {
        console.error("Erreur getHistoriqueArrivees :", err);
        res.status(500).json({ message: "Erreur serveur." });
    }
};


exports.exportAbsencesPDF = async (req, res) => {
    const db = req.app.get('db');

    try {
        const [rows] = await db.execute(`
            SELECT u.nom, u.prenom, COUNT(DISTINCT d.date) AS absences
            FROM utilisateurs u
            CROSS JOIN (
                SELECT CURDATE() - INTERVAL a DAY AS date
                FROM (SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                      UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
                      UNION ALL SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 13 UNION ALL SELECT 14
                      UNION ALL SELECT 15 UNION ALL SELECT 16 UNION ALL SELECT 17 UNION ALL SELECT 18 UNION ALL SELECT 19
                      UNION ALL SELECT 20 UNION ALL SELECT 21 UNION ALL SELECT 22 UNION ALL SELECT 23 UNION ALL SELECT 24
                      UNION ALL SELECT 25 UNION ALL SELECT 26 UNION ALL SELECT 27 UNION ALL SELECT 28 UNION ALL SELECT 29) AS jours
            ) d
            LEFT JOIN (
                SELECT utilisateur_id, DATE(horodatage) AS date
                FROM pointages
            ) p ON p.utilisateur_id = u.id AND p.date = d.date
            WHERE p.date IS NULL
            GROUP BY u.id
        `);

        const doc = new PDFDocument();
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=absences.pdf');
        doc.pipe(res);

        doc.fontSize(16).text('Liste des absences par utilisateur', { align: 'center' }).moveDown();

        rows.forEach((user, index) => {
            doc.fontSize(12).text(`${index + 1}. ${user.prenom} ${user.nom} - Absences : ${user.absences}`);
        });

        doc.end();
    } catch (err) {
        console.error("Erreur génération PDF :", err);
        res.status(500).json({ message: "Erreur serveur lors de la génération du PDF." });
    }
};
