<<<<<<< HEAD
const PDFDocument = ../../ AppgestH / config / dbkit');

// ✅ Récupérer tous les pointages
exports.getPointages = async (req, res) => {
    const db = req.app.get('db');
    try {
        const [results] = await db.execute(`
=======
// controllers/pointageController.js
const db = require('../config/db'); // Ce db doit venir de mysql2/promise


exports.getPointages = async (req, res) => {
    try {
        const [results] = await db.query(`
>>>>>>> 93f5a34d (PROJETTUTORER)
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

<<<<<<< HEAD
// ✅ Ajouter manuellement un pointage (admin/manager)
exports.ajouterPointage = async (req, res) => {
    const db = req.app.get('db');
=======
exports.ajouterPointage = async (req, res) => {
>>>>>>> 93f5a34d (PROJETTUTORER)
    const { utilisateur_id, type } = req.body;

    if (!utilisateur_id || !type) {
        return res.status(400).json({ message: 'Champs manquants.' });
    }

    try {
<<<<<<< HEAD
        const [lastPointage] = await db.execute(
=======
        // Récupérer le dernier pointage de l'utilisateur pour aujourd'hui
        const [lastPointage] = await db.query(
>>>>>>> 93f5a34d (PROJETTUTORER)
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

<<<<<<< HEAD
        await db.execute(
=======
        // Si pas de doublon, insérer le pointage
        await db.query(
>>>>>>> 93f5a34d (PROJETTUTORER)
            'INSERT INTO pointages (utilisateur_id, type, horodatage) VALUES (?, ?, NOW())',
            [utilisateur_id, type]
        );

        res.status(201).json({ message: 'Pointage enregistré.' });
    } catch (err) {
        console.error('Erreur lors de l\'ajout du pointage :', err);
        res.status(500).json({ message: 'Erreur serveur.' });
    }
};

<<<<<<< HEAD
// ✅ Pointage automatique via badge
exports.pointerAvecBadge = async (req, res) => {
    const db = req.app.get('db');
    const { badge_code } = req.body;

    if (!badge_code) {
        return res.status(400).json({ message: 'Badge code requis.' });
    }

    try {
        const [users] = await db.execute(
            'SELECT id, nom FROM utilisateurs WHERE badge_code = ?',
            [badge_code]
        );

        if (users.length === 0) {
            return res.status(404).json({ message: 'Badge non reconnu.' });
        }

        const utilisateur = users[0];

        const [dernierPointage] = await db.execute(
            `SELECT type FROM pointages
             WHERE utilisateur_id = ? AND DATE(horodatage) = CURDATE()
             ORDER BY horodatage DESC
             LIMIT 1`,
            [utilisateur.id]
        );

        let type = 'entrée';
        if (dernierPointage.length > 0 && dernierPointage[0].type.toLowerCase() === 'entree') {
            type = 'sortie';
        }

        await db.execute(
            'INSERT INTO pointages (utilisateur_id, type, horodatage) VALUES (?, ?, NOW())',
            [utilisateur.id, type === 'entrée' ? 'entree' : 'sortie']
        );

        res.json({ message: `Pointage "${type}" enregistré pour ${utilisateur.nom}` });

    } catch (error) {
        console.error('Erreur serveur :', error);
        res.status(500).json({ message: 'Erreur serveur lors du pointage.' });
    }
};

// ✅ Export PDF des pointages pour un utilisateur
exports.exportPointagesPDF = async (req, res) => {
    const db = req.app.get('db');
=======


exports.exportPointagesPDF = async (req, res) => {
>>>>>>> 93f5a34d (PROJETTUTORER)
    const utilisateur_id = req.query.utilisateur_id;

    if (!utilisateur_id) {
        return res.status(400).json({ message: 'ID utilisateur requis' });
    }

    try {
<<<<<<< HEAD
        const [rows] = await db.execute(`
            SELECT p.id, u.nom AS nom_utilisateur, p.type, p.horodatage
=======
        const [rows] = await db.query(`
            SELECT p.id, u.nom AS utilisateur, p.type, p.horodatage
>>>>>>> 93f5a34d (PROJETTUTORER)
            FROM pointages p
            JOIN utilisateurs u ON p.utilisateur_id = u.id
            WHERE p.utilisateur_id = ?
            ORDER BY p.horodatage DESC
        `, [utilisateur_id]);

<<<<<<< HEAD
        const doc = new PDFDocument();
=======
        const PDFDocument = require('pdfkit');
        const doc = new PDFDocument();

>>>>>>> 93f5a34d (PROJETTUTORER)
        res.setHeader('Content-Disposition', 'attachment; filename=mes_pointages.pdf');
        res.setHeader('Content-Type', 'application/pdf');
        doc.pipe(res);

<<<<<<< HEAD
        doc.fontSize(18).text('Mes Pointages', { align: 'center' }).moveDown();

        rows.forEach(p => {
            doc.fontSize(12).text(`Nom: ${p.nom_utilisateur}`);
            doc.text(`Type: ${p.type}`);
            doc.text(`Date: ${new Date(p.horodatage).toLocaleString()}`);
            doc.moveDown();
=======
        doc.fontSize(18).text('Mes Pointages', { align: 'center' });
        doc.moveDown();

        rows.forEach(p => {
            doc.fontSize(12).text(`Nom: ${p.utilisateur} | Type: ${p.type} | Date: ${new Date(p.horodatage).toLocaleString()}`);
>>>>>>> 93f5a34d (PROJETTUTORER)
        });

        doc.end();
    } catch (err) {
<<<<<<< HEAD
        console.error('Erreur export PDF :', err);
        res.status(500).json({ message: 'Erreur lors de l\'export PDF' });
    }
};

// ✅ Filtrer les pointages par date
exports.getPointagesAvecFiltre = async (req, res) => {
    const db = req.app.get('db');
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
        const [rows] = await db.execute(query, params);
        res.json(rows);
    } catch (err) {
        console.error('Erreur récupération pointages filtrés :', err);
        res.status(500).json({ message: 'Erreur lors de la récupération des pointages.' });
    }
};

// ✅ Récupérer le résumé du jour d’un utilisateur
exports.resumeDuJour = async (req, res) => {
    const db = req.app.get('db');
    const utilisateur_id = req.params.id;

    try {
        const [pointages] = await db.execute(
            `SELECT type, horodatage
             FROM pointages
             WHERE utilisateur_id = ? AND DATE(horodatage) = CURDATE()
             ORDER BY horodatage ASC`,
            [utilisateur_id]
        );

        const [planning] = await db.execute(
            `SELECT date, heure_debut, heure_fin, description
             FROM plannings
             WHERE utilisateur_id = ? AND DATE(date) = CURDATE()
             LIMIT 1`,
            [utilisateur_id]
        );

        const [conges] = await db.execute(
            `SELECT date_debut, date_fin, statut
             FROM demandes_conge
             WHERE utilisateur_id = ?
             AND CURDATE() BETWEEN date_debut AND date_fin
             AND statut = 'accepté'
             LIMIT 1`,
            [utilisateur_id]
        );

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

// ✅ Historique des pointages d’un utilisateur
exports.getHistoriquePointages = async (req, res) => {
    const db = req.app.get('db');
    const utilisateurId = req.params.id;

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
=======
        console.error('Erreur export PDF utilisateur :', err);
        res.status(500).json({ message: 'Erreur lors de l\'export PDF' });
    }
};
>>>>>>> 93f5a34d (PROJETTUTORER)
