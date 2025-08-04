// On utilise req.app.get('db') pour chaque requête
const utilisateurController = {};

// === Utilisateurs CRUD & Actions ===

// 1. Récupérer tous les utilisateurs
utilisateurController.getAllUtilisateurs = async (req, res) => {
    const db = req.app.get('db');
    try {
        const [rows] = await db.execute(`
            SELECT id, nom, prenom, email, role, poste, telephone, jour_repos, 
                   date_embauche, badge_code, dernier_login, actif
            FROM utilisateurs
        `);
        res.json(rows);
    } catch (err) {
        console.error('❌ Erreur lors de la récupération des utilisateurs :', err);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération des utilisateurs.' });
    }
};

// 2. Récupérer un utilisateur par ID
utilisateurController.getUtilisateurById = async (req, res) => {
    const db = req.app.get('db');
    const { id } = req.params;

    if (!id) return res.status(400).json({ message: "ID utilisateur requis" });

    try {
        const [rows] = await db.execute('SELECT * FROM utilisateurs WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ message: 'Utilisateur non trouvé' });
        res.json(rows[0]);
    } catch (err) {
        console.error('❌ Erreur récupération utilisateur :', err);
        res.status(500).json({ message: 'Erreur serveur lors de la récupération.' });
    }
};

// 3. Ajouter un utilisateur
utilisateurController.ajouterUtilisateur = async (req, res) => {
    const db = req.app.get('db');
    const {
        nom, prenom, email, mot_de_passe, role,
        poste, telephone, jour_repos, date_embauche, badge_code
    } = req.body;

    if (!nom || !prenom || !email || !mot_de_passe || !role) {
        return res.status(400).json({ message: "Champs requis manquants" });
    }

    try {
        await db.execute(`
            INSERT INTO utilisateurs 
            (nom, prenom, email, mot_de_passe, role, poste, telephone, jour_repos, date_embauche, badge_code)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nom, prenom, email, mot_de_passe, role, poste, telephone, jour_repos, date_embauche, badge_code]
        );
        res.status(201).json({ message: '✅ Utilisateur ajouté avec succès' });
    } catch (err) {
        console.error('❌ Erreur ajout utilisateur :', err);
        res.status(500).json({ message: 'Erreur serveur lors de l\'ajout de l\'utilisateur.' });
    }
};

// 4. Modifier un utilisateur
utilisateurController.modifierUtilisateur = async (req, res) => {
    const db = req.app.get('db');
    const utilisateurId = req.params.id;

    const {
        nom, prenom, email, mot_de_passe,
        role, poste, telephone, jour_repos,
        date_embauche, badge_code
    } = req.body;

    if (!utilisateurId) return res.status(400).json({ message: "ID utilisateur requis" });

    try {
        let sql = `
            UPDATE utilisateurs 
            SET nom = ?, prenom = ?, email = ?, role = ?, poste = ?, 
                telephone = ?, jour_repos = ?, date_embauche = ?, badge_code = ?`;
        const params = [nom, prenom, email, role, poste, telephone, jour_repos, date_embauche, badge_code];

        if (mot_de_passe) {
            sql += `, mot_de_passe = ?`;
            params.push(mot_de_passe);
        }

        sql += ` WHERE id = ?`;
        params.push(utilisateurId);

        const [result] = await db.execute(sql, params);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        res.json({ message: '✅ Utilisateur mis à jour avec succès' });
    } catch (err) {
        console.error('❌ Erreur modification utilisateur :', err);
        res.status(500).json({ message: 'Erreur serveur lors de la modification.' });
    }
};

// 5. Désactiver un utilisateur (Soft Delete)
utilisateurController.supprimerUtilisateur = async (req, res) => {
    const db = req.app.get('db');
    const utilisateurId = req.params.id;

    if (!utilisateurId) return res.status(400).json({ message: "ID utilisateur requis" });

    try {
        const [result] = await db.execute(
            'UPDATE utilisateurs SET actif = 0 WHERE id = ?', [utilisateurId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        res.json({ message: "✅ Utilisateur désactivé avec succès" });
    } catch (err) {
        console.error('❌ Erreur désactivation utilisateur :', err);
        res.status(500).json({ message: "Erreur serveur lors de la désactivation." });
    }
};

// 6. Changer le rôle d’un utilisateur
utilisateurController.changerRole = async (req, res) => {
    const db = req.app.get('db');
    const { id } = req.params;
    const { role } = req.body;

    if (!role) return res.status(400).json({ message: "Nouveau rôle requis" });

    try {
        const [result] = await db.execute('UPDATE utilisateurs SET role = ? WHERE id = ?', [role, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        res.json({ message: "✅ Rôle mis à jour avec succès" });
    } catch (err) {
        console.error('❌ Erreur changement rôle :', err);
        res.status(500).json({ message: "Erreur serveur lors de la mise à jour du rôle." });
    }
};

// 7. Activer/Désactiver un utilisateur (toggleStatus)
utilisateurController.toggleStatus = async (req, res) => {
    const db = req.app.get('db');
    const { id } = req.params;
    const { actif } = req.body;

    if (typeof actif === 'undefined') {
        return res.status(400).json({ message: "Valeur du statut requise (1 ou 0)" });
    }

    try {
        const [result] = await db.execute(
            'UPDATE utilisateurs SET actif = ? WHERE id = ?', [actif ? 1 : 0, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        res.json({ message: `✅ Utilisateur ${actif ? 'activé' : 'désactivé'} avec succès` });
    } catch (err) {
        console.error('❌ Erreur changement statut utilisateur :', err);
        res.status(500).json({ message: "Erreur serveur lors du changement de statut." });
    }
};

module.exports = utilisateurController;
