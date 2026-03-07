const mysql = require('mysql2/promise');
require('dotenv').config();

const host = process.env.DB_HOST;
const port = parseInt(process.env.DB_PORT, 10) || 3306;

if (!host) {
  console.error('CRITICAL ERROR: DB_HOST environment variable is missing.');
}

const pool = mysql.createPool({
  host: host,
  port: port,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    rejectUnauthorized: false
  },
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  connectTimeout: 10000 // 10 seconds timeout
});

console.log('Database pool initialized:');
console.log('- Host:', host);
console.log('- Port:', port);
console.log('- User defined:', !!process.env.DB_USER);
console.log('- DB Name defined:', !!process.env.DB_NAME);

module.exports = pool;
