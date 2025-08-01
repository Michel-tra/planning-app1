// backend/config/db.js
//PERMET de configurer la connexion à la base de données MySQL
const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'planning',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = db;
