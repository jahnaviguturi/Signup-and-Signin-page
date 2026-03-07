require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const pool = require('./config/db');

// Global error handlers to catch startup crashes
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    // On Render, we want to log the error before exiting
    setTimeout(() => process.exit(1), 1000);
});

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: true, // Allow all frontend origins or replace with specific URL
    credentials: true
}));

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Authentication Backend API is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api', userRoutes); // Protected routes

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Global Error Handler:', err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Check database connection and initialize tables on startup
const initDB = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Database connected successfully to host:', process.env.DB_HOST);

        // Define the users table schema
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS users (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(255) NOT NULL UNIQUE,
                email VARCHAR(255) NOT NULL UNIQUE,
                phone VARCHAR(20),
                password VARCHAR(255) NOT NULL,
                role VARCHAR(50) DEFAULT 'USER',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;

        // Use .query() for DDL as it's more compatible than .execute()
        await connection.query(createTableQuery);
        console.log('Database tables initialized (users table checked/created).');

        // Ensure columns exist (Schema migration for existing tables)
        const columns = [
            { name: 'username', type: 'VARCHAR(255) NOT NULL UNIQUE' },
            { name: 'email', type: 'VARCHAR(255) NOT NULL UNIQUE' },
            { name: 'phone', type: 'VARCHAR(20)' },
            { name: 'password', type: 'VARCHAR(255) NOT NULL' },
            { name: 'role', type: "VARCHAR(50) DEFAULT 'USER'" }
        ];

        for (const col of columns) {
            try {
                // We use .query() for ALTER TABLE as well
                await connection.query(`ALTER TABLE users ADD COLUMN ${col.name} ${col.type}`);
                console.log(`Successfully added missing column: ${col.name}`);
            } catch (err) {
                // ER_DUP_COLUMN_NAME (1060). Node-mysql2 sometimes uses err.errno
                if (err.errno !== 1060 && err.code !== 'ER_DUP_COLUMN_NAME') {
                    console.error(`Status of column ${col.name}:`, err.message);
                }
            }
        }

        // Final verification: log the actual schema
        const [rows] = await connection.query('DESCRIBE users');
        console.log('Current users table schema:');
        rows.forEach(row => console.log(` - ${row.Field}: ${row.Type}`));

        connection.release();
        return true; // Success
    } catch (err) {
        console.error('CRITICAL: Database initialization failed:', err.message);
        throw err; // Re-throw to prevent server startup
    }
};

// Start server only after DB initialization is complete
initDB().then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(err => {
    console.error('SERVER STARTUP PREVENTED: Database initialization failed.');
    console.error(err);
});

module.exports = app;
