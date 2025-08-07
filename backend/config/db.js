const mysql = require('mysql2/promise');
require('dotenv').config();

const isProd = process.env.NODE_ENV === 'production';

const pool = mysql.createPool({
    host: isProd ? process.env.PROD_DB_HOST : process.env.LOCAL_DB_HOST,
    user: isProd ? process.env.PROD_DB_USER : process.env.LOCAL_DB_USER,
    password: isProd ? process.env.PROD_DB_PASSWORD : process.env.LOCAL_DB_PASSWORD,
    database: isProd ? process.env.PROD_DB_NAME : process.env.LOCAL_DB_NAME,
    port: isProd ? process.env.PROD_DB_PORT : process.env.LOCAL_DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

console.log(`✅ Connecté à la base ${isProd ? 'production' : 'locale'}`);

module.exports = pool;
