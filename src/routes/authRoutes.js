const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');

// Debug: Log available functions
console.log('Auth controller functions loaded:', Object.keys(authController));

// Public routes - NO authentication required
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected routes - Require authentication
router.get('/me', auth, authController.getMe);
router.post('/logout', auth, authController.logout);

// Test route
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Auth routes are working!',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;