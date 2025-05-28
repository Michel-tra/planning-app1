<<<<<<< HEAD
const getAllEmployes = async (req, res) => {
    const db = req.app.get('db');
    try {
        const [rows] = await db.execute(
            `SELECT id, nom, prenom, email, telephone, role, jour_repos, 
                    TIMESTAMPDIFF(YEAR, date_embauche, CURDATE()) AS anciennete
             FROM utilisateurs
             WHERE role = 'employe'`
        );
=======
const getAllEmployes = async (req, res, db) => {
    try {
        const [rows] = await db.query('SELECT * FROM employes');
>>>>>>> 93f5a34d (PROJETTUTORER)
        res.status(200).json(rows);
    } catch (error) {
        console.error('Erreur getAllEmployes :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

<<<<<<< HEAD
const addEmploye = async (req, res) => {
    const db = req.app.get('db');
    const { nom, prenom, email, telephone, jour_repos, date_embauche } = req.body;
    try {
        await db.execute(
            `INSERT INTO utilisateurs (nom, prenom, email, telephone, role, jour_repos, date_embauche, actif, est_connecte)
             VALUES (?, ?, ?, ?, 'employe', ?, ?, 1, 0)`,
            [nom, prenom, email, telephone, jour_repos, date_embauche]
=======
const addEmploye = async (req, res, db) => {
    const { nom, poste, email, telephone, anciennete } = req.body;
    try {
        await db.query(
            'INSERT INTO employes (nom, poste, email, telephone, anciennete) VALUES (?, ?, ?, ?, ?)',
            [nom, poste, email, telephone, anciennete]
>>>>>>> 93f5a34d (PROJETTUTORER)
        );
        res.status(201).json({ message: 'Employé ajouté' });
    } catch (error) {
        console.error('Erreur addEmploye :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

<<<<<<< HEAD
const updateEmploye = async (req, res) => {
    const db = req.app.get('db');
    const { id } = req.params;
    const { nom, prenom, email, telephone, jour_repos, date_embauche } = req.body;
    try {
        await db.execute(
            `UPDATE utilisateurs 
             SET nom = ?, prenom = ?, email = ?, telephone = ?, jour_repos = ?, date_embauche = ? 
             WHERE id = ? AND role = 'employe'`,
            [nom, prenom, email, telephone, jour_repos, date_embauche, id]
=======
const updateEmploye = async (req, res, db) => {
    const { id } = req.params;
    const { nom, poste, email, telephone, anciennete } = req.body;
    try {
        await db.query(
            'UPDATE employes SET nom = ?, poste = ?, email = ?, telephone = ?, anciennete = ? WHERE id = ?',
            [nom, poste, email, telephone, anciennete, id]
>>>>>>> 93f5a34d (PROJETTUTORER)
        );
        res.status(200).json({ message: 'Employé mis à jour' });
    } catch (error) {
        console.error('Erreur updateEmploye :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

<<<<<<< HEAD
const deleteEmploye = async (req, res) => {
    const db = req.app.get('db');
    const { id } = req.params;
    try {
        await db.execute('DELETE FROM utilisateurs WHERE id = ? AND role = "employe"', [id]);
=======
const deleteEmploye = async (req, res, db) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM employes WHERE id = ?', [id]);
>>>>>>> 93f5a34d (PROJETTUTORER)
        res.status(200).json({ message: 'Employé supprimé' });
    } catch (error) {
        console.error('Erreur deleteEmploye :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

<<<<<<< HEAD
const getResumeEmploye = async (req, res) => {
    const db = req.app.get('db');
    const utilisateurId = req.params.id;

    try {
        const [[{ totalPlannings }]] = await db.execute(
            'SELECT COUNT(*) AS totalPlannings FROM plannings WHERE utilisateur_id = ?',
            [utilisateurId]
        );

        const [[{ totalConges }]] = await db.execute(
            'SELECT COUNT(*) AS totalConges FROM demandes_conge WHERE utilisateur_id = ?',
            [utilisateurId]
        );

        const [[{ totalPointages }]] = await db.execute(
            'SELECT COUNT(*) AS totalPointages FROM pointages WHERE utilisateur_id = ?',
            [utilisateurId]
        );

        res.status(200).json({
            totalPlannings,
            totalConges,
            totalPointages
        });
    } catch (error) {
        console.error('Erreur getResumeEmploye :', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

=======
>>>>>>> 93f5a34d (PROJETTUTORER)
module.exports = {
    getAllEmployes,
    addEmploye,
    updateEmploye,
<<<<<<< HEAD
    deleteEmploye,
    getResumeEmploye
=======
    deleteEmploye
>>>>>>> 93f5a34d (PROJETTUTORER)
};
