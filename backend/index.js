const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const db = require('./config/db');
<<<<<<< HEAD
const planningRoutes = require('./routes/plannings');
const employeRoutes = require('./routes/employeRoutes')(db);
const pointageRoutes = require('./routes/pointageRoutes');
const demandesCongeRoutes = require('./routes/demandesCongeRoutes');
const utilisateurRoutes = require('./routes/utilisateurRoutes');
const historiqueRoutes = require('./routes/historiqueRoutes')(db);
const adminRoutes = require('./routes/adminRoutes');
const statsRoutes = require('./routes/statsRoutes');


// Initialisation de l'application Express
=======
const planningRoutes = require('./routes/plannings'); // corrigé ici
const employeRoutes = require('./routes/employeRoutes')(db);
const pointageRoutes = require('./routes/pointageRoutes');
const congesRoutes = require('./routes/conges');







>>>>>>> 93f5a34d (PROJETTUTORER)
const app = express();
const port = 5000;

app.set('db', db); // rendre la DB accessible dans les contrôleurs

app.use(cors());
app.use(express.json());

// Route test
app.get('/', (req, res) => {
    res.send('Backend opérationnel ✅');
});

// Routes
app.use('/api/plannings', planningRoutes);
<<<<<<< HEAD
app.use('/api', authRoutes);
app.use('/api/employes', employeRoutes);
app.use('/api/pointages', pointageRoutes);
app.use('/api/conges', demandesCongeRoutes);
app.use('/api/utilisateurs', utilisateurRoutes);
app.use('/api/historique', historiqueRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/admin', adminRoutes);


// Gestion des erreurs 404  
app.use((req, res) => {
    console.log("❌ Route non trouvée :", req.method, req.originalUrl);
    res.status(404).json({ message: 'Route non trouvée' });
});



=======
app.use('/api/login', authRoutes(db));
app.use('/api/employes', employeRoutes);
app.use('/api/pointages', pointageRoutes);
app.use('/api/conges', congesRoutes);
>>>>>>> 93f5a34d (PROJETTUTORER)

app.listen(port, () => {
    console.log(`Serveur backend démarré sur le port ${port}`);
});
