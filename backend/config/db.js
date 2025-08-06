const mysql = require('mysql2/promise');
require('dotenv').config();

let pool;

if (process.env.NODE_ENV === 'production') {
    // === Railway Production Database ===
    pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
    console.log('✅ Connected to Railway Production DB');
} else {
    // === Local Development Database ===
    pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'planning',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });
    console.log('✅ Connected to Local MySQL DB');
}

module.exports = pool;
