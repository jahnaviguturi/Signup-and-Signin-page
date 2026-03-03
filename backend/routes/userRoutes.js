const express = require('express');
const { getDashboard } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Protected route
router.get('/dashboard', authMiddleware, getDashboard);

module.exports = router;
