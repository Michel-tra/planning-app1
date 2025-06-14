const db = require('../config/db'); // mysql2/promise
const PDFDocument = require('pdfkit');

// Récupérer tous les pointages
exports.getPointages = async (req, res) => {
    try {
        const [results] = await db.query(`
            SELECT p.id, p.utilisateur_id, u.nom AS nom_utilisateur, p.type, p.horodatage
            FROM pointages p
            JOIN utilisateurs u ON p.utilisateur_id = u.id
            ORDER BY p.horodatage DESC
        `);
        res.json(results);
    } catch (err) {
        console.error('Erreur SQL :', err);
        res.status(500).json({ message: 'Erreur lors de la récupération des pointages.' });
    }
};

// Ajouter manuellement un pointage (admin/manager)
exports.ajouterPointage = async (req, res) => {
    const { utilisateur_id, type } = req.body;

    if (!utilisateur_id || !type) {
        return res.status(400).json({ message: 'Champs manquants.' });
    }

    try {
        const [lastPointage] = await db.query(
            `SELECT type FROM pointages 
             WHERE utilisateur_id = ? 
             AND DATE(horodatage) = CURDATE() 
             ORDER BY horodatage DESC 
             LIMIT 1`,
            [utilisateur_id]
        );

        if (lastPointage.length > 0 && lastPointage[0].type === type) {
            return res.status(409).json({ message: `Vous avez déjà pointé "${type}" récemment.` });
        }

        await db.query(
            'INSERT INTO pointages (utilisateur_id, type, horodatage) VALUES (?, ?, NOW())',
            [utilisateur_id, type]
        );

        res.status(201).json({ message: 'Pointage enregistré.' });
    } catch (err) {
        console.error('Erreur lors de l\'ajout du pointage :', err);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
};
console.log("✅ Fonctions exportées :", module.exports);


// Pointage automatique via badge (entrée/sortie)
exports.pointerAvecBadge = async (req, res) => {
    const { badge_code } = req.body;

    try {
        // 1. Trouver l'utilisateur
        const [users] = await db.query(
            'SELECT id, nom FROM utilisateurs WHERE badge_code = ?',
            [badge_code]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'Badge non reconnu.' });
        }




        const utilisateur = users[0];
        console.log("🔔 Badge scanné :", badge_code);

        // 2. Récupérer le dernier pointage d'aujourd'hui
        const [dernierPointage] = await db.query(
            `SELECT type FROM pointages
             WHERE utilisateur_id = ? AND DATE(horodatage) = CURDATE()
             ORDER BY horodatage DESC
             LIMIT 1`,
            [utilisateur.id]
        );
        console.log("📦 Dernier pointage du jour :", dernierPointage);
        // 3. Déterminer le type de pointage
        let type = 'entrée';
        if (dernierPointage.length > 0 && dernierPointage[0].type.toLowerCase() === 'entree') {
            type = 'sortie';
        }

        console.log("🧭 Type décidé :", type);

        // 4. Enregistrer le pointage
        await db.query(
            'INSERT INTO pointages (utilisateur_id, type, horodatage) VALUES (?, ?, NOW())',
            [utilisateur.id, type === 'entrée' ? 'entree' : 'sortie']
        );
        console.log("✅ Pointage enregistré pour :", utilisateur.nom);
        return res.json({ message: `Pointage "${type}" enregistré pour ${utilisateur.nom}` });

    } catch (error) {
        console.error('Erreur serveur :', error);
        res.status(500).json({ message: 'Erreur serveur lors du pointage.' });
    }
};

// Export PDF des pointages pour un utilisateur
exports.exportPointagesPDF = async (req, res) => {
    const utilisateur_id = req.query.utilisateur_id;

    if (!utilisateur_id) {
        return res.status(400).json({ message: 'ID utilisateur requis' });
    }

    try {
        const [rows] = await db.query(`
            SELECT p.id, u.nom AS nom_utilisateur, p.type, p.horodatage
            FROM pointages p
            JOIN utilisateurs u ON p.utilisateur_id = u.id
            WHERE p.utilisateur_id = ?
            ORDER BY p.horodatage DESC
        `, [utilisateur_id]);

        const doc = new PDFDocument();

        res.setHeader('Content-Disposition', 'attachment; filename=mes_pointages.pdf');
        res.setHeader('Content-Type', 'application/pdf');
        doc.pipe(res);

        doc.fontSize(18).text('Mes Pointages', { align: 'center' }).moveDown();

        rows.forEach(p => {
            doc.fontSize(12).text(`Nom: ${p.utilisateur}`);
            doc.text(`Type: ${p.type}`);
            doc.text(`Date: ${new Date(p.horodatage).toLocaleString()}`);
            doc.moveDown();
        });

        doc.end();
    } catch (err) {
        console.error('Erreur export PDF :', err);
        res.status(500).json({ message: 'Erreur lors de l\'export PDF' });
    }
};

// Filtrer par date (optionnel)
exports.getPointagesAvecFiltre = async (req, res) => {
    const { date } = req.query;

    let query = `
        SELECT p.id, u.nom AS nom_utilisateur, p.type, p.horodatage
        FROM pointages p
        JOIN utilisateurs u ON p.utilisateur_id = u.id
    `;
    const params = [];

    if (date) {
        query += ` WHERE DATE(p.horodatage) = ?`;
        params.push(date);
    }

    query += ` ORDER BY p.horodatage DESC`;

    try {
        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (err) {
        console.error('Erreur récupération pointages filtrés :', err);
        res.status(500).json({ message: 'Erreur lors de la récupération des pointages.' });
    }
};
exports.resumeDuJour = async (req, res) => {
    const utilisateur_id = req.params.id;

    try {
        // Récupérer les pointages du jour
        const [pointages] = await db.query(
            `SELECT type, horodatage
             FROM pointages
             WHERE utilisateur_id = ? AND DATE(horodatage) = CURDATE()
             ORDER BY horodatage ASC`,
            [utilisateur_id]
        );

        // Récupérer le planning du jour
        const [planning] = await db.query(
            `SELECT date, heure_debut, heure_fin, description
             FROM plannings
             WHERE utilisateur_id = ? AND DATE(date) = CURDATE()
             LIMIT 1`,
            [utilisateur_id]
        );

        // Récupérer les congés du jour
        const [conges] = await db.query(
            `SELECT date_debut, date_fin, statut
             FROM demandes_conge
             WHERE utilisateur_id = ?
             AND CURDATE() BETWEEN date_debut AND date_fin
             AND statut = 'accepté'
             LIMIT 1`,
            [utilisateur_id]
        );

        // Formater les données
        const formatDate = (isoDate) => {
            const d = new Date(isoDate);
            return d.toLocaleDateString('fr-FR') + ' à ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
        };

        const data = {
            pointages: pointages.map(p => ({
                type: p.type,
                horodatage: formatDate(p.horodatage)
            })),
            planning: planning.length > 0 ? {
                heure_debut: planning[0].heure_debut,
                heure_fin: planning[0].heure_fin,
                description: planning[0].description,
                date: new Date(planning[0].date).toLocaleDateString('fr-FR')
            } : null,
            conge: conges.length > 0 ? {
                date_debut: new Date(conges[0].date_debut).toLocaleDateString('fr-FR'),
                date_fin: new Date(conges[0].date_fin).toLocaleDateString('fr-FR'),
                statut: conges[0].statut
            } : null
        };

        res.json(data);

    } catch (err) {
        console.error("Erreur dans resumeDuJour :", err);
        res.status(500).json({ message: "Erreur lors de la récupération du résumé du jour." });
    }
};
// Récupérer l'historique des pointages d’un employé
exports.getHistoriquePointages = async (req, res) => {
    const utilisateurId = req.params.id;
    const db = req.app.get('db');
    try {
        const [rows] = await db.execute(
            'SELECT * FROM pointages WHERE utilisateur_id = ? ORDER BY horodatage DESC',
            [utilisateurId]
        );
        res.json(rows);
    } catch (err) {
        console.error('Erreur lors du chargement des pointages :', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
