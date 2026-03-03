const db = require('./config/db');

async function createTable() {
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      uid INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) UNIQUE,
      email VARCHAR(150),
      phone VARCHAR(20),
      password VARCHAR(255),
      role VARCHAR(20)
    )
  `;
    try {
        await db.query(createTableQuery);
        console.log('Users table created or verified successfully in Aiven MySQL.');
    } catch (err) {
        console.error('Error creating table:', err.message);
    } finally {
        process.exit();
    }
}

createTable();
