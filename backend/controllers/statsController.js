exports.getManagerStats = async (req, res) => {
    const db = req.app.get('db');
    const managerId = req.query.managerId;

    try {
        // Utilisateurs connectés
        const [connectes] = await db.execute(`
            SELECT id, nom, prenom, role FROM utilisateurs WHERE est_connecte = 1
        `);
        const nbConnectes = connectes.length;

        // Plannings cette semaine
        const [[{ plannings }]] = await db.execute(`
            SELECT COUNT(*) AS plannings FROM plannings 
            WHERE WEEK(date) = WEEK(CURDATE()) AND YEAR(date) = YEAR(CURDATE())
        `);

        // Congés en attente
        const [[{ conges }]] = await db.execute(`
            SELECT COUNT(*) AS conges FROM demandes_conge WHERE statut = 'en_attente'
        `);

        // Absents aujourd'hui (connecté mais sans pointage aujourd’hui, hors jour de repos)
        const [absents] = await db.execute(`
            SELECT u.id, u.nom, u.prenom
            FROM utilisateurs u
            LEFT JOIN pointages p ON u.id = p.utilisateur_id AND DATE(p.horodatage) = CURDATE()
            WHERE u.est_connecte = 1
              AND p.id IS NULL
              AND NOT EXISTS (
                  SELECT 1 FROM plannings
                  WHERE utilisateur_id = u.id 
                  AND DATE(date) = CURDATE() 
                  AND jour_repos = 1
              )
        `);

        // Retards (heure d’arrivée après 09:05:00)
        const [[{ nb: retardsJour }]] = await db.execute(`
            SELECT COUNT(*) AS nb FROM pointages 
            WHERE DATE(horodatage) = CURDATE() AND TIME(horodatage) > '09:05:00'
        `);

        // Pointage du manager aujourd'hui
        const [[{ aPointe }]] = await db.execute(`
            SELECT COUNT(*) AS aPointe FROM pointages 
            WHERE utilisateur_id = ? AND DATE(horodatage) = CURDATE()
        `, [managerId]);


        // Utilisateurs attendus aujourd'hui (hors jour de repos et congé)
        // Obtenir le jour actuel (en toutes lettres) pour comparer avec jour_repos
        const [currentDayRow] = await db.execute(`SELECT DAYNAME(CURDATE()) AS today`);
        const currentDay = currentDayRow[0].today.toLowerCase();

        // Utilisateurs attendus aujourd’hui (hors congé et hors jour de repos)
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

        const nbAttendus = attendus.length;

        // Utilisateurs ayant pointé aujourd’hui
        const [pointes] = await db.execute(`
    SELECT DISTINCT utilisateur_id 
    FROM pointages 
    WHERE DATE(horodatage) = CURDATE()
`);
        const nbPointes = pointes.length;

        // Calcul du taux
        let tauxPointage = "0%";
        if (nbAttendus > 0) {
            tauxPointage = `${Math.round((nbPointes / nbAttendus) * 100)}%`;
        }

        // Préparation de la réponse
        res.json({
            employesActifs: nbConnectes,
            utilisateursConnectes: connectes,
            planningsSemaine: plannings,
            congesEnAttente: conges,
            absencesJour: absents.length,
            retardsJour,
            etatPointageManager: aPointe > 0 ? 'Présent' : 'Absent',
            tauxPointage: tauxPointage,

        });

    } catch (err) {
        console.error("Erreur stats manager :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
