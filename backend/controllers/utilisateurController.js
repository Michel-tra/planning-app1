const db = require('../config/db');

exports.getAllUtilisateurs = (req, res) => {
    db.query('SELECT * FROM utilisateurs', (err, results) => {
        if (err) return res.status(500).json({ message: 'Erreur serveur' });
        res.json(results);
    });
};

exports.ajouterUtilisateur = (req, res) => {
    const { nom, email, mot_de_passe, role } = req.body;
    db.query('INSERT INTO utilisateurs (nom, email, mot_de_passe, role) VALUES (?, ?, ?, ?)',
        [nom, email, mot_de_passe, role], (err) => {
            if (err) return res.status(500).json({ message: 'Erreur serveur' });
            res.status(201).json({ message: 'Utilisateur ajouté avec succès' });
        });
};

exports.modifierUtilisateur = (req, res) => {
    const { nom, email, mot_de_passe, role } = req.body;
    db.query('UPDATE utilisateurs SET nom = ?, email = ?, mot_de_passe = ?, role = ? WHERE id = ?',
        [nom, email, mot_de_passe, role, req.params.id], (err) => {
            if (err) return res.status(500).json({ message: 'Erreur serveur' });
            res.json({ message: 'Utilisateur mis à jour' });
        });
};

exports.supprimerUtilisateur = (req, res) => {
    db.query('DELETE FROM utilisateurs WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ message: 'Erreur serveur' });
        res.json({ message: 'Utilisateur supprimé' });
    });
};
