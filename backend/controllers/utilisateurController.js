// controllers/utilisateurController.js

// On n'importe plus `db` ici car on utilise `req.app.get('db')` dans chaque fonction

// Récupérer tous les utilisateurs
exports.getAllUtilisateurs = async (req, res) => {
    const db = req.app.get('db');
    try {
        const [rows] = await db.execute(`
            SELECT id, nom, prenom, email, role, poste, telephone, jour_repos, date_embauche, dernier_login
        FROM utilisateurs
        `);
        res.json(rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des utilisateurs :', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Ajouter un utilisateur
exports.ajouterUtilisateur = async (req, res) => {
    const db = req.app.get('db');
    const { nom, email, mot_de_passe, role, poste, telephone, jour_repos, date_embauche } = req.body;
    try {
        await db.execute(
            `INSERT INTO utilisateurs (nom, email, mot_de_passe, role, poste, telephone, jour_repos, date_embauche)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [nom, email, mot_de_passe, role, poste, telephone, jour_repos, date_embauche]
        );
        res.status(201).json({ message: 'Utilisateur ajouté avec succès' });
    } catch (err) {
        console.error('Erreur ajout utilisateur :', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Modifier un utilisateur
exports.modifierUtilisateur = async (req, res) => {
    const db = req.app.get('db');
    const { nom, email, mot_de_passe, role, poste, telephone, jour_repos, date_embauche } = req.body;
    try {
        await db.execute(
            `UPDATE utilisateurs 
             SET nom = ?, email = ?, mot_de_passe = ?, role = ?, poste = ?, telephone = ?, jour_repos = ?, date_embauche = ?
             WHERE id = ?`,
            [nom, email, mot_de_passe, role, poste, telephone, jour_repos, date_embauche, req.params.id]
        );
        res.json({ message: 'Utilisateur mis à jour' });
    } catch (err) {
        console.error('Erreur modification utilisateur :', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Supprimer un utilisateur
exports.supprimerUtilisateur = async (req, res) => {
    const db = req.app.get('db');
    try {
        await db.execute('DELETE FROM utilisateurs WHERE id = ?', [req.params.id]);
        res.json({ message: 'Utilisateur supprimé' });
    } catch (err) {
        console.error('Erreur suppression utilisateur :', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Changer le rôle
exports.changerRole = async (req, res) => {
    const db = req.app.get('db');
    const { id } = req.params;
    const { role } = req.body;

    try {
        await db.execute('UPDATE utilisateurs SET role = ? WHERE id = ?', [role, id]);
        res.json({ message: "Rôle mis à jour avec succès" });
    } catch (error) {
        console.error("Erreur changement rôle :", error);
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// Activer / Désactiver un utilisateur
exports.toggleStatus = async (req, res) => {
    const db = req.app.get('db');
    const { id } = req.params;
    const { actif } = req.body;

    try {
        await db.execute('UPDATE utilisateurs SET actif = ? WHERE id = ?', [actif ? 1 : 0, id]);
        res.json({ message: "Statut mis à jour avec succès" });
    } catch (err) {
        console.error("Erreur statut utilisateur :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
