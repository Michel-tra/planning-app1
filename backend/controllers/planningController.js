const db = require('../config/db');

const getAll = async (req, res) => {
    const database = req.app.get('db');
    try {
        const [rows] = await database.execute('SELECT * FROM plannings');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const create = async (req, res) => {
    const { utilisateur_id, date, heure_debut, heure_fin } = req.body;
    const database = req.app.get('db');
    try {
        const [result] = await database.execute(
            'INSERT INTO plannings (utilisateur_id, date, heure_debut, heure_fin) VALUES (?, ?, ?, ?)',
            [utilisateur_id, date, heure_debut, heure_fin]
        );
        res.status(201).json({ id: result.insertId });
    } catch (err) {
        console.error('Erreur lors de la création du planning', err);
        res.status(500).json({ error: 'Erreur serveur' });
    }
};

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
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const remove = async (req, res) => {
    const { id } = req.params;
    const database = req.app.get('db');
    try {
        await database.execute('DELETE FROM plannings WHERE id = ?', [id]);
        res.json({ message: 'Planning supprimé' });
    } catch (err) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const getPlanningPersonnel = async (req, res) => {
    const utilisateurId = req.params.id;
    try {
        const [rows] = await db.query('SELECT * FROM plannings WHERE utilisateur_id = ?', [utilisateurId]);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Erreur lors de la récupération du planning personnel.' });
    }
};

// ✅ Export propre à la fin
module.exports = {
    getAll,
    create,
    update,
    remove,
    getPlanningPersonnel
};
