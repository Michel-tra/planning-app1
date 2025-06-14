const db = require('../config/db');

// Récupérer tous les utilisateurs (employés)
exports.getAllUtilisateurs = async (req, res) => {
    try {
        const [rows] = await db.execute(`
            SELECT id, nom, email, role, poste, telephone, jour_repos, date_embauche
            FROM utilisateurs
        `);
        res.json(rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des utilisateurs :', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Ajouter un utilisateur
exports.ajouterUtilisateur = (req, res) => {
    const { nom, email, mot_de_passe, role, poste, telephone, jour_repos, date_embauche } = req.body;
    db.query(
        `INSERT INTO utilisateurs (nom, email, mot_de_passe, role, poste, telephone, jour_repos, date_embauche)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [nom, email, mot_de_passe, role, poste, telephone, jour_repos, date_embauche],
        (err) => {
            if (err) return res.status(500).json({ message: 'Erreur serveur' });
            res.status(201).json({ message: 'Utilisateur ajouté avec succès' });
        }
    );
};

// Modifier un utilisateur
exports.modifierUtilisateur = (req, res) => {
    const { nom, email, mot_de_passe, role, poste, telephone, jour_repos, date_embauche } = req.body;
    db.query(
        `UPDATE utilisateurs 
         SET nom = ?, email = ?, mot_de_passe = ?, role = ?, poste = ?, telephone = ?, jour_repos = ?, date_embauche = ?
         WHERE id = ?`,
        [nom, email, mot_de_passe, role, poste, telephone, jour_repos, date_embauche, req.params.id],
        (err) => {
            if (err) return res.status(500).json({ message: 'Erreur serveur' });
            res.json({ message: 'Utilisateur mis à jour' });
        }
    );
};

// Supprimer un utilisateur
exports.supprimerUtilisateur = (req, res) => {
    db.query('DELETE FROM utilisateurs WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json({ message: 'Erreur serveur' });
        res.json({ message: 'Utilisateur supprimé' });
    });
};
