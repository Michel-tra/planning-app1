const mysql = require('mysql2/promise');
<<<<<<< HEAD
require('dotenv').config();

const pool = mysql.createPool({
<<<<<<< HEAD
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
=======

<<<<<<< HEAD
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'planning',
>>>>>>> 93f5a34d (PROJETTUTORER)
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

<<<<<<< HEAD
module.exports = pool;
=======
module.exports = db;
>>>>>>> 93f5a34d (PROJETTUTORER)
=======
let connection;

(async () => {
    try {
        connection = await mysql.createConnection(process.env.DATABASE_URL);
        console.log('✅ Connecté à la base de données (Railway)');
    } catch (error) {
        console.error('❌ Erreur de connexion à la DB :', error);
    }
})();

module.exports = {
    getConnection: () => connection
};
>>>>>>> 98352656 (Mise à jour : API fix et intégration React build)
=======
    uri: process.env.DATABASE_URL,
    waitForConnections: true,
    connectionLimit: 10,  // Tu peux ajuster selon le besoin
    queueLimit: 0
});

module.exports = pool;
>>>>>>> 1d7a665b (correction)
