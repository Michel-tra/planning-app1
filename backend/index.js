require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./config/db');

// Routes
const authRoutes = require('./routes/authRoutes');
const planningRoutes = require('./routes/plannings');
const employeRoutes = require('./routes/employeRoutes');
const pointageRoutes = require('./routes/pointageRoutes');
const demandesCongeRoutes = require('./routes/demandesCongeRoutes');
const utilisateurRoutes = require('./routes/utilisateurRoutes');
const historiqueRoutes = require('./routes/historiqueRoutes')(db);
const adminRoutes = require('./routes/adminRoutes');
const statsRoutes = require('./routes/statsRoutes');

// Initialisation de l'application Express
const app = express();
const port = process.env.PORT || 3001;

// rendre la DB accessible dans les contrôleurs via req.app.get('db')
app.set('db', db);

// Middleware
app.use(cors());
app.use(express.json());

// ================= Routes API =================
app.use('/api', authRoutes);
app.use('/api/plannings', planningRoutes);
app.use('/api/employes', employeRoutes);
app.use('/api/pointages', pointageRoutes);
app.use('/api/conges', demandesCongeRoutes);
app.use('/api/utilisateurs', utilisateurRoutes);
app.use('/api/historique', historiqueRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/admin', adminRoutes);

// ============ SERVE REACT FRONTEND BUILD ============
app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('*', (req, res) => {
    if (req.originalUrl.startsWith('/api')) {
        console.log("❌ Route API non trouvée :", req.method, req.originalUrl);
        res.status(404).json({ message: 'Route API non trouvée' });
    } else {
        res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
    }
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`🚀 Serveur backend démarré sur le port ${port}`);
});
