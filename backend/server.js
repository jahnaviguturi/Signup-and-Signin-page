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

        await connection.execute(createTableQuery);
        console.log('Database tables initialized (users table checked/created).');

        connection.release();
    } catch (err) {
        console.error('CRITICAL: Database initialization failed:', err.message);
    }
};

initDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
