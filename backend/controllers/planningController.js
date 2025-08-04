const db = require('../config/db');

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 1d7a665b (correction)
// ✅ Récupérer tous les plannings
const getAll = async (req, res) => {
    const db = req.app.get('db');
    try {
        const [rows] = await db.execute(`
            SELECT p.*, u.nom
            FROM plannings p
            JOIN utilisateurs u ON p.utilisateur_id = u.id
            ORDER BY p.date DESC
        `);
        res.json(rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des plannings :', err);
=======
const getAll = async (req, res) => {
    const database = req.app.get('db');
    try {
        const [rows] = await database.execute('SELECT * FROM plannings');
        res.json(rows);
    } catch (err) {
>>>>>>> 93f5a34d (PROJETTUTORER)
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 1d7a665b (correction)
// ✅ Créer un planning
const create = async (req, res) => {
    const { utilisateur_id, date, heure_debut, heure_fin, description } = req.body;
    const db = req.app.get('db');

    if (!utilisateur_id || !date || !heure_debut || !heure_fin) {
        return res.status(400).json({ message: 'Champs requis manquants' });
    }

<<<<<<< HEAD
    try {
        const [result] = await db.execute(
            `INSERT INTO plannings (utilisateur_id, date, heure_debut, heure_fin, description) VALUES (?, ?, ?, ?, ?)`,
            [utilisateur_id, date, heure_debut, heure_fin, description]
=======
const create = async (req, res) => {
    const { utilisateur_id, date, heure_debut, heure_fin } = req.body;
    const database = req.app.get('db');
    try {
        const [result] = await database.execute(
            'INSERT INTO plannings (utilisateur_id, date, heure_debut, heure_fin) VALUES (?, ?, ?, ?)',
            [utilisateur_id, date, heure_debut, heure_fin]
>>>>>>> 93f5a34d (PROJETTUTORER)
=======
    try {
        const [result] = await db.execute(
            `INSERT INTO plannings (utilisateur_id, date, heure_debut, heure_fin, description) VALUES (?, ?, ?, ?, ?)`,
            [utilisateur_id, date, heure_debut, heure_fin, description]
>>>>>>> 1d7a665b (correction)
        );
        res.status(201).json({ id: result.insertId });
    } catch (err) {
        console.error('Erreur lors de la création du planning', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 1d7a665b (correction)
// ✅ Mettre à jour un planning
const update = async (req, res) => {
    const { id } = req.params;
    const { date, heure_debut, heure_fin, description } = req.body;
    const db = req.app.get('db');

    if (!date || !heure_debut || !heure_fin) {
        return res.status(400).json({ message: 'Champs requis manquants' });
    }

    try {
        const [result] = await db.execute(
            `UPDATE plannings SET date = ?, heure_debut = ?, heure_fin = ?, description = ? WHERE id = ?`,
            [date, heure_debut, heure_fin, description, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Planning non trouvé' });
        }

        res.json({ message: 'Planning mis à jour' });
    } catch (err) {
        console.error(err);
<<<<<<< HEAD
=======
const update = async (req, res) => {
    const { id } = req.params;
    const { utilisateur_id, date, heure_debut, heure_fin } = req.body;
    const database = req.app.get('db');
    try {
        await database.execute(
            'UPDATE plannings SET utilisateur_id = ?, date = ?, heure_debut = ?, heure_fin = ? WHERE id = ?',
            [utilisateur_id, date, heure_debut, heure_fin, id]
        );
        res.json({ message: 'Planning mis à jour' });
    } catch (err) {
>>>>>>> 93f5a34d (PROJETTUTORER)
=======
>>>>>>> 1d7a665b (correction)
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

<<<<<<< HEAD
<<<<<<< HEAD
// ✅ Supprimer un planning
const remove = async (req, res) => {
    const { id } = req.params;
    const db = req.app.get('db');

    try {
        const [result] = await db.execute('DELETE FROM plannings WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Planning non trouvé' });
        }

        res.json({ message: 'Planning supprimé' });
    } catch (err) {
        console.error(err);
=======
=======
// ✅ Supprimer un planning
>>>>>>> 1d7a665b (correction)
const remove = async (req, res) => {
    const { id } = req.params;
    const db = req.app.get('db');

    try {
        const [result] = await db.execute('DELETE FROM plannings WHERE id = ?', [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Planning non trouvé' });
        }

        res.json({ message: 'Planning supprimé' });
    } catch (err) {
<<<<<<< HEAD
>>>>>>> 93f5a34d (PROJETTUTORER)
=======
        console.error(err);
>>>>>>> 1d7a665b (correction)
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 1d7a665b (correction)
// ✅ Récupérer le planning personnel d'un utilisateur
const getPlanningPersonnel = async (req, res) => {
    const db = req.app.get('db');
    const utilisateurId = req.params.id;

    try {
        const [rows] = await db.execute(
            `SELECT p.id, p.utilisateur_id, p.date, p.heure_debut, p.heure_fin, p.description, u.nom 
             FROM plannings p 
             JOIN utilisateurs u ON p.utilisateur_id = u.id 
             WHERE p.utilisateur_id = ? 
             ORDER BY p.date DESC`,
            [utilisateurId]
        );
=======
const getPlanningPersonnel = async (req, res) => {
    const utilisateurId = req.params.id;
    try {
        const [rows] = await db.query('SELECT * FROM plannings WHERE utilisateur_id = ?', [utilisateurId]);
>>>>>>> 93f5a34d (PROJETTUTORER)
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération du planning personnel.' });
    }
};

<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 1d7a665b (correction)
// ✅ Récupérer les plannings d'un utilisateur sur une période
const getPlanningsParUtilisateurEtPeriode = async (req, res) => {
    const db = req.app.get('db');
    const { id } = req.params;
    const { annee, mois } = req.query;

    try {
        let query = `
            SELECT p.*, u.nom
            FROM plannings p
            JOIN utilisateurs u ON p.utilisateur_id = u.id
            WHERE p.utilisateur_id = ?
        `;
        const params = [id];

        if (annee && mois) {
            query += ` AND YEAR(p.date) = ? AND MONTH(p.date) = ?`;
            params.push(annee, mois);
        } else if (annee) {
            query += ` AND YEAR(p.date) = ?`;
            params.push(annee);
        }

        const [rows] = await db.execute(query, params);
        res.json(rows);
    } catch (err) {
        console.error('Erreur récupération planning filtré:', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// ✅ Créer un pointage
const creerPointage = async (req, res) => {
    const db = req.app.get('db');
    const { utilisateur_id, date, heure } = req.body;

    if (!utilisateur_id || !date || !heure) {
        return res.status(400).json({ message: "Champs requis manquants" });
    }

    try {
        const [result] = await db.execute(
            `INSERT INTO pointages (utilisateur_id, date, heure) VALUES (?, ?, ?)`,
            [utilisateur_id, date, heure]
        );
        res.status(201).json({ message: "Pointage enregistré", id: result.insertId });
    } catch (error) {
        console.error("Erreur lors du pointage :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

<<<<<<< HEAD
=======
// ✅ Export propre à la fin
>>>>>>> 93f5a34d (PROJETTUTORER)
=======
>>>>>>> 1d7a665b (correction)
module.exports = {
    getAll,
    create,
    update,
    remove,
<<<<<<< HEAD
    getPlanningPersonnel,
    getPlanningsParUtilisateurEtPeriode,
    creerPointage,
=======
    getPlanningPersonnel
>>>>>>> 93f5a34d (PROJETTUTORER)
};
