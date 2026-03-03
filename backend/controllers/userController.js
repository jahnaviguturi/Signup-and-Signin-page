const getDashboard = (req, res) => {
    // req.user is attached by the authMiddleware
    res.status(200).json({
        message: 'Welcome to your dashboard',
        user: req.user
    });
};

module.exports = { getDashboard };
