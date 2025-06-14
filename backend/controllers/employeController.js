const getAllEmployes = async (req, res, db) => {
    try {
        const [rows] = await db.query('SELECT * FROM employes');
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erreur getAllEmployes :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const addEmploye = async (req, res, db) => {
    const { nom, poste, email, telephone, anciennete } = req.body;
    try {
        await db.query(
            'INSERT INTO employes (nom, poste, email, telephone, anciennete) VALUES (?, ?, ?, ?, ?)',
            [nom, poste, email, telephone, anciennete]
        );
        res.status(201).json({ message: 'Employé ajouté' });
    } catch (error) {
        console.error('Erreur addEmploye :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const updateEmploye = async (req, res, db) => {
    const { id } = req.params;
    const { nom, poste, email, telephone, anciennete } = req.body;
    try {
        await db.query(
            'UPDATE employes SET nom = ?, poste = ?, email = ?, telephone = ?, anciennete = ? WHERE id = ?',
            [nom, poste, email, telephone, anciennete, id]
        );
        res.status(200).json({ message: 'Employé mis à jour' });
    } catch (error) {
        console.error('Erreur updateEmploye :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

const deleteEmploye = async (req, res, db) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM employes WHERE id = ?', [id]);
        res.status(200).json({ message: 'Employé supprimé' });
    } catch (error) {
        console.error('Erreur deleteEmploye :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};
const getResumeEmploye = async (req, res, db) => {
    const utilisateurId = req.params.id;

    try {
        // Compter les plannings de l'utilisateur
        const [plannings] = await db.query(
            'SELECT COUNT(*) AS total FROM plannings WHERE utilisateur_id = ?',
            [utilisateurId]
        );

        // Compter les demandes de congé de l'utilisateur
        const [conges] = await db.query(
            'SELECT COUNT(*) AS total FROM demandes_conge WHERE utilisateur_id = ?',
            [utilisateurId]
        );

        // Compter les pointages de l'utilisateur
        const [pointages] = await db.query(
            'SELECT COUNT(*) AS total FROM pointages WHERE utilisateur_id = ?',
            [utilisateurId]
        );

        res.status(200).json({
            totalPlannings: plannings[0].total,
            totalConges: conges[0].total,
            totalPointages: pointages[0].total
        });
    } catch (error) {
        console.error('Erreur getResumeEmploye :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};


module.exports = {
    getAllEmployes,
    addEmploye,
    updateEmploye,
    deleteEmploye,
    getResumeEmploye
};
