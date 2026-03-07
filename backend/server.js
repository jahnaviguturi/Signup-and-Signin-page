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

// Check database connection on startup
pool.getConnection()
    .then(connection => {
        console.log('Database connected successfully to host:', process.env.DB_HOST);
        connection.release();
    })
    .catch(err => {
        console.error('CRITICAL: Database connection failed:', err.message);
    });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
