// controllers/utilisateurController.js

// On n'importe plus `db` ici car on utilise `req.app.get('db')` dans chaque fonction

// Récupérer tous les utilisateurs
exports.getAllUtilisateurs = async (req, res) => {
    const db = req.app.get('db');
    try {
        const [rows] = await db.execute(`
            SELECT id, nom, prenom, email, role, poste, telephone, jour_repos, date_embauche, badge_code, dernier_login, actif
            FROM utilisateurs
        `);
        res.json(rows);
    } catch (err) {
        console.error('Erreur lors de la récupération des utilisateurs :', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Récupérer un utilisateur par ID
exports.getUtilisateurById = async (req, res) => {
    const db = req.app.get('db');
    const { id } = req.params;

    try {
        const [rows] = await db.execute('SELECT * FROM utilisateurs WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Erreur getUtilisateurById :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


// Ajouter un utilisateur
exports.ajouterUtilisateur = async (req, res) => {
    const db = req.app.get('db');
    const {
        nom, prenom, email, mot_de_passe, role,
        poste, telephone, jour_repos, date_embauche, badge_code
    } = req.body;

    try {
        await db.execute(
            `INSERT INTO utilisateurs 
            (nom, prenom, email, mot_de_passe, role, poste, telephone, jour_repos, date_embauche, badge_code)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nom, prenom, email, mot_de_passe, role, poste, telephone, jour_repos, date_embauche, badge_code]
        );
        res.status(201).json({ message: '✅ Utilisateur ajouté avec succès' });
    } catch (err) {
        console.error('Erreur ajout utilisateur :', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


// Modifier un utilisateur
// ✅ contrôleur corrigé avec prenom et badge inclus
exports.modifierUtilisateur = async (req, res) => {
    const db = req.app.get('db');
    const {
        nom,
        prenom,
        email,
        mot_de_passe,
        role,
        poste,
        telephone,
        jour_repos,
        date_embauche,
        badge_code
    } = req.body;

    try {
        let sql = `
            UPDATE utilisateurs 
            SET nom = ?, prenom = ?, email = ?, role = ?, poste = ?, telephone = ?, jour_repos = ?, date_embauche = ?, badge_code = ?`;

        const params = [nom, prenom, email, role, poste, telephone, jour_repos, date_embauche, badge_code];

        if (mot_de_passe) {
            sql += `, mot_de_passe = ?`;
            params.push(mot_de_passe);
        }

        sql += ` WHERE id = ?`;
        params.push(req.params.id);

        await db.execute(sql, params);

        res.json({ message: 'Utilisateur mis à jour' });
    } catch (err) {
        console.error('❌ Erreur modification utilisateur :', err);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


// Supprimer un utilisateur
// // exports.supprimerUtilisateur = async (req, res) => {
//     const db = req.app.get('db');
//     const { id } = req.params;
//     console.log("🗑️ Suppression utilisateur ID =", id);

//     try {
//         const [result] = await db.execute('DELETE FROM utilisateurs WHERE id = ?', [id]);

//         if (result.affectedRows === 0) {
//             return res.status(404).json({ message: 'Utilisateur non trouvé' });
//         }

//         res.json({ message: '✅ Utilisateur supprimé avec succès' });
//     } catch (err) {
//         console.error('❌ Erreur suppression utilisateur :', err);
//         res.status(500).json({ message: 'Erreur serveur' });
//     }
// *//
// Désactiver (soft delete) un utilisateur au lieu de supprimer
exports.supprimerUtilisateur = async (req, res) => {
    const db = req.app.get('db');
    const utilisateurId = req.params.id;

    try {
        const [result] = await db.execute(
            'UPDATE utilisateurs SET actif = 0 WHERE id = ?',
            [utilisateurId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        res.json({ message: "Utilisateur désactivé avec succès" });
    } catch (err) {
        console.error('❌ Erreur lors de la désactivation de l\'utilisateur :', err);
        res.status(500).json({ message: "Erreur serveur" });
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
    console.log("🔥 Requête reçue pour modifier le statut !");
    const db = req.app.get('db');
    const { id } = req.params;
    const { actif } = req.body;
    console.log(`🔁 Changement de statut utilisateur ID=${id}, actif=${actif}`);

    try {
        await db.execute('UPDATE utilisateurs SET actif = ? WHERE id = ?', [actif ? 1 : 0, id]);
        res.json({ message: "Statut mis à jour avec succès" });
    } catch (err) {
        console.error("Erreur statut utilisateur :", err);
        res.status(500).json({ message: "Erreur serveur" });
    }
};
