<<<<<<< HEAD
const PDFDocument = require('pdfkit');

=======
>>>>>>> 24d514b8 (20/06/2025)
// ================================
// Partie : Stats globales manager
// ================================

<<<<<<< HEAD
=======
/**
 * Récupère les statistiques générales du tableau de bord manager :
 * utilisateurs connectés, taux de pointage, absences, retards, plannings, etc.
 */
>>>>>>> 24d514b8 (20/06/2025)
exports.getManagerStats = async (req, res) => {
    const db = req.app.get('db');
    const managerId = req.query.managerId;

    try {
<<<<<<< HEAD
        // 1. Utilisateurs connectés
=======
        // Utilisateurs actuellement connectés
>>>>>>> 24d514b8 (20/06/2025)
        const [connectes] = await db.execute(`
            SELECT id, nom, prenom, role 
            FROM utilisateurs 
            WHERE est_connecte = 1
        `);

        const nbConnectes = connectes.length;

<<<<<<< HEAD
        // 2. Plannings de la semaine
=======
        // Plannings de la semaine actuelle
>>>>>>> 24d514b8 (20/06/2025)
        const [[{ plannings }]] = await db.execute(`
            SELECT COUNT(*) AS plannings 
            FROM plannings
            WHERE WEEK(DATE(date), 1) = WEEK(CURDATE(), 1)
              AND YEAR(date) = YEAR(CURDATE())
        `);

<<<<<<< HEAD
        // 3. Congés en attente
=======
        // Congés en attente de validation
>>>>>>> 24d514b8 (20/06/2025)
        const [[{ conges }]] = await db.execute(`
            SELECT COUNT(*) AS conges 
            FROM demandes_conge 
            WHERE statut = 'en_attente'
        `);

<<<<<<< HEAD
        // 4. Absents aujourd’hui
=======
        // Absents aujourd'hui (connectés, non pointés, hors jour de repos)
>>>>>>> 24d514b8 (20/06/2025)
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

<<<<<<< HEAD
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
=======
        // Retards du jour (arrivée après 09h05)
        const [[{ nb: retardsJour }]] = await db.execute(`
            SELECT COUNT(*) AS nb FROM pointages 
            WHERE DATE(horodatage) = CURDATE() AND TIME(horodatage) > '09:05:00'
>>>>>>> 24d514b8 (20/06/2025)
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

<<<<<<< HEAD
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

=======
        // Taux de pointage
        const [currentDayRow] = await db.execute(`SELECT DAYNAME(CURDATE()) AS today`);
        const currentDay = currentDayRow[0].today.toLowerCase();

        const [attendus] = await db.execute(`
            SELECT DISTINCT u.id
            FROM utilisateurs u
            LEFT JOIN demandes_conge dc 
                ON dc.utilisateur_id = u.id 
                AND dc.statut = 'en_attente'
                AND CURDATE() BETWEEN dc.date_debut AND dc.date_fin
            WHERE dc.id IS NULL
              AND LOWER(u.jour_repos) != ?
        `, [currentDay]);
>>>>>>> 24d514b8 (20/06/2025)
        const nbAttendus = attendus.length;

        const [pointes] = await db.execute(`
            SELECT DISTINCT utilisateur_id 
            FROM pointages 
            WHERE DATE(horodatage) = CURDATE()
        `);
<<<<<<< HEAD

=======
>>>>>>> 24d514b8 (20/06/2025)
        const nbPointes = pointes.length;
        const tauxPointage = nbAttendus > 0 ? `${Math.round((nbPointes / nbAttendus) * 100)}%` : '0%';

<<<<<<< HEAD
=======
        let tauxPointage = "0%";
        if (nbAttendus > 0) {
            tauxPointage = `${Math.round((nbPointes / nbAttendus) * 100)}%`;
        }

>>>>>>> 24d514b8 (20/06/2025)
        res.json({
            employesActifs: nbConnectes,
            utilisateursConnectes: connectes,
            planningsSemaine: plannings,
            congesEnAttente: conges,
<<<<<<< HEAD
            absentsAujourdhui: absencesJour,
            retardsAujourdhui: retardsJour,
            etatPointageManager,
            tauxDePointage: tauxPointage
=======
            absencesJour: absents.length,
            retardsJour,
            etatPointageManager: aPointe > 0 ? 'Présent' : 'Absent',
            tauxPointage: tauxPointage,
>>>>>>> 24d514b8 (20/06/2025)
        });

    } catch (err) {
        console.error("Erreur stats manager :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

<<<<<<< HEAD
// ================================
// Partie : Stats Absences (par mois, utilisateur, résumé)
// ================================

=======
/**
 * Statistiques d’absences par mois sur une année
 */
>>>>>>> 24d514b8 (20/06/2025)
exports.getAbsencesParMois = async (req, res) => {
    const db = req.app.get('db');
    const annee = req.query.annee || new Date().getFullYear();

    try {
        const [rows] = await db.execute(`
<<<<<<< HEAD
            SELECT MONTH(date_debut) AS mois, COUNT(*) AS total
=======
            SELECT 
                MONTH(date_debut) AS mois,
                COUNT(*) AS total
>>>>>>> 24d514b8 (20/06/2025)
            FROM demandes_conge
            WHERE statut = 'accepte' AND YEAR(date_debut) = ?
            GROUP BY mois
            ORDER BY mois
        `, [annee]);

<<<<<<< HEAD
        const moisLabels = ['', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
            'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
=======
        const moisLabels = [
            '', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
            'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
        ];
>>>>>>> 24d514b8 (20/06/2025)

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

<<<<<<< HEAD
=======
/**
 * Statistiques d’absences par utilisateur sur 30 jours
 */
>>>>>>> 24d514b8 (20/06/2025)
exports.getAbsencesParUtilisateur = async (req, res) => {
    const db = req.app.get('db');

    try {
        const [rows] = await db.execute(`
            SELECT 
<<<<<<< HEAD
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
=======
                u.id,
                u.nom,
                u.prenom,
                COUNT(DISTINCT d.date) AS total_jours,
                COUNT(DISTINCT d.date) - COUNT(DISTINCT p_date.date) AS absences,
                ROUND(100 * (COUNT(DISTINCT d.date) - COUNT(DISTINCT p_date.date)) / COUNT(DISTINCT d.date), 2) AS taux_absence,
                ROUND(100 * COUNT(DISTINCT p_date.date) / COUNT(DISTINCT d.date), 2) AS taux_presence
            FROM utilisateurs u
            CROSS JOIN (
                SELECT CURDATE() - INTERVAL a DAY AS date
                FROM (
                    SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                    UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
                    UNION ALL SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 13 UNION ALL SELECT 14
                    UNION ALL SELECT 15 UNION ALL SELECT 16 UNION ALL SELECT 17 UNION ALL SELECT 18 UNION ALL SELECT 19
                    UNION ALL SELECT 20 UNION ALL SELECT 21 UNION ALL SELECT 22 UNION ALL SELECT 23 UNION ALL SELECT 24
                    UNION ALL SELECT 25 UNION ALL SELECT 26 UNION ALL SELECT 27 UNION ALL SELECT 28 UNION ALL SELECT 29
                ) AS days
>>>>>>> 24d514b8 (20/06/2025)
            ) d
            LEFT JOIN (
                SELECT utilisateur_id, DATE(horodatage) AS date
                FROM pointages
<<<<<<< HEAD
            ) p ON p.utilisateur_id = u.id AND p.date = d.date
=======
            ) p_date ON p_date.utilisateur_id = u.id AND p_date.date = d.date
>>>>>>> 24d514b8 (20/06/2025)
            GROUP BY u.id
        `);

        res.json(rows);
    } catch (err) {
        console.error("Erreur stats utilisateurs :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

<<<<<<< HEAD
=======
/**
 * Résumé général des absences (moyenne)
 */
exports.getResumeAbsences = async (req, res) => {
    const db = req.app.get('db');

    try {
        const [rows] = await db.execute(`
            SELECT COUNT(*) AS total_utilisateurs, 
                   ROUND(AVG(absences), 2) AS moyenne
            FROM (
                SELECT u.id, 
                       SUM(CASE 
                           WHEN p.jour IS NULL THEN 1 
                           ELSE 0 
                       END) AS absences
                FROM utilisateurs u
                LEFT JOIN (
                    SELECT utilisateur_id, DATE(horodatage) AS jour
                    FROM pointages
                    GROUP BY utilisateur_id, DATE(horodatage)
                ) p ON p.utilisateur_id = u.id
                GROUP BY u.id
            ) AS sub
        `);

        res.json(rows[0]);
    } catch (err) {
        console.error("Erreur résumé absences :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

exports.getRetardsParUtilisateur = async (req, res) => {
    const db = req.app.get('db');
    const { filtre, annee, mois, semaine } = req.query;

    let condition = "1=1";
    const params = [];

    if (filtre === 'annee' && annee) {
        condition = "YEAR(p.horodatage) = ?";
        params.push(annee);
    } else if (filtre === 'mois' && annee && mois) {
        condition = "YEAR(p.horodatage) = ? AND MONTH(p.horodatage) = ?";
        params.push(annee, mois);
    } else if (filtre === 'semaine' && annee && semaine) {
        condition = "YEAR(p.horodatage) = ? AND WEEK(p.horodatage, 1) = ?";
        params.push(annee, semaine);
    }

    try {
        const [rows] = await db.execute(`
            SELECT u.id, u.nom, u.prenom, COUNT(*) AS total_retards
            FROM utilisateurs u
            JOIN pointages p ON u.id = p.utilisateur_id
            WHERE TIME(p.horodatage) > '09:05:00' AND ${condition}
            GROUP BY u.id
            ORDER BY total_retards DESC
        `, params);

        res.json(rows);
    } catch (err) {
        console.error("Erreur retards par utilisateur :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
// controllers/statsController.js
>>>>>>> 24d514b8 (20/06/2025)
exports.getAbsencesParMoisEtUtilisateur = async (req, res) => {
    const db = req.app.get('db');
    const annee = req.query.annee || new Date().getFullYear();

    try {
        const [rows] = await db.execute(`
<<<<<<< HEAD
            SELECT u.nom, u.prenom, MONTH(dc.date_debut) AS mois, COUNT(*) AS total
=======
            SELECT 
                u.nom,
                u.prenom,
                MONTH(dc.date_debut) AS mois,
                COUNT(*) AS total
>>>>>>> 24d514b8 (20/06/2025)
            FROM demandes_conge dc
            JOIN utilisateurs u ON u.id = dc.utilisateur_id
            WHERE dc.statut = 'accepte' AND YEAR(dc.date_debut) = ?
            GROUP BY u.id, mois
            ORDER BY mois, total DESC
        `, [annee]);

<<<<<<< HEAD
        const moisLabels = ['', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
            'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
=======
        const moisLabels = [
            '', 'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
            'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
        ];
>>>>>>> 24d514b8 (20/06/2025)

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

<<<<<<< HEAD
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
=======
// =================================
// Partie : Stats admin (à ajouter)
// =================================

// exports.getAdminStats = ...
// exports.getCongesParUtilisateur = ...
// exports.getPointagesParJour = ...



//Partie : stats employé 


exports.getTauxAbsenceUtilisateur = async (req, res) => {
    const db = req.app.get('db');
    const utilisateurId = req.params.id;

    try {
        const [rows] = await db.execute(`
            SELECT COUNT(DISTINCT d.date) AS total_jours,
                   COUNT(DISTINCT d.date) - COUNT(DISTINCT p.date) AS absences
            FROM (
                SELECT CURDATE() - INTERVAL a DAY AS date
                FROM (
                    SELECT 0 AS a UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4
                    UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9
                    UNION ALL SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 13 UNION ALL SELECT 14
                    UNION ALL SELECT 15 UNION ALL SELECT 16 UNION ALL SELECT 17 UNION ALL SELECT 18 UNION ALL SELECT 19
                    UNION ALL SELECT 20 UNION ALL SELECT 21 UNION ALL SELECT 22 UNION ALL SELECT 23 UNION ALL SELECT 24
                    UNION ALL SELECT 25 UNION ALL SELECT 26 UNION ALL SELECT 27 UNION ALL SELECT 28 UNION ALL SELECT 29
                ) AS jours
            ) d
            LEFT JOIN (
                SELECT DATE(horodatage) AS date
                FROM pointages
                WHERE utilisateur_id = ?
            ) p ON d.date = p.date
        `, [utilisateurId]);

        const total = rows[0].total_jours || 1;
        const abs = rows[0].absences || 0;
        const presence = total - abs;

        res.json({
            utilisateur: `Moi`,
            taux_presence: ((presence / total) * 100).toFixed(2),
            taux_absence: ((abs / total) * 100).toFixed(2),
        });

    } catch (err) {
        console.error("Erreur taux personnel :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
exports.getHistoriqueArrivees = async (req, res) => {
    const db = req.app.get('db');
    const utilisateurId = req.params.id;

    try {
        const [rows] = await db.execute(`
            SELECT 
                DATE(horodatage) AS jour,
                TIME(MIN(horodatage)) AS heure_arrivee
            FROM pointages
            WHERE utilisateur_id = ?
              AND DATE(horodatage) >= CURDATE() - INTERVAL 30 DAY
            GROUP BY DATE(horodatage)
            ORDER BY jour ASC
        `, [utilisateurId]);

        res.json(rows);
    } catch (err) {
        console.error("Erreur historique des arrivées :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

>>>>>>> 24d514b8 (20/06/2025)
