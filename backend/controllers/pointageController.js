// controllers/pointageController.js
const db = require('../config/db'); // Ce db doit venir de mysql2/promise


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

exports.ajouterPointage = async (req, res) => {
    const { utilisateur_id, type } = req.body;

    if (!utilisateur_id || !type) {
        return res.status(400).json({ message: 'Champs manquants.' });
    }

    try {
        // Récupérer le dernier pointage de l'utilisateur pour aujourd'hui
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

        // Si pas de doublon, insérer le pointage
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



exports.exportPointagesPDF = async (req, res) => {
    const utilisateur_id = req.query.utilisateur_id;

    if (!utilisateur_id) {
        return res.status(400).json({ message: 'ID utilisateur requis' });
    }

    try {
        const [rows] = await db.query(`
            SELECT p.id, u.nom AS utilisateur, p.type, p.horodatage
            FROM pointages p
            JOIN utilisateurs u ON p.utilisateur_id = u.id
            WHERE p.utilisateur_id = ?
            ORDER BY p.horodatage DESC
        `, [utilisateur_id]);

        const PDFDocument = require('pdfkit');
        const doc = new PDFDocument();

        res.setHeader('Content-Disposition', 'attachment; filename=mes_pointages.pdf');
        res.setHeader('Content-Type', 'application/pdf');
        doc.pipe(res);

        doc.fontSize(18).text('Mes Pointages', { align: 'center' });
        doc.moveDown();

        rows.forEach(p => {
            doc.fontSize(12).text(`Nom: ${p.utilisateur} | Type: ${p.type} | Date: ${new Date(p.horodatage).toLocaleString()}`);
        });

        doc.end();
    } catch (err) {
        console.error('Erreur export PDF utilisateur :', err);
        res.status(500).json({ message: 'Erreur lors de l\'export PDF' });
    }
};
