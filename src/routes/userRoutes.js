const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth } = require('../middleware/auth');
const { checkPermission } = require('../middleware/permission');

// Debug
console.log('User controller functions loaded:', Object.keys(userController));

// Test route
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'User routes are working!',
    timestamp: new Date().toISOString()
  });
});

// All user routes require authentication
router.use(auth);

// Protected routes
router.get('/', checkPermission('view_user'), userController.getAllUsers);
router.get('/:id', checkPermission('view_user'), userController.getUserById);
router.post('/', checkPermission('create_user'), userController.createUser);
router.put('/:id', checkPermission('update_user'), userController.updateUser);
router.delete('/:id', checkPermission('delete_user'), userController.deleteUser);
router.get('/stats/summary', checkPermission('view_reports'), userController.getUserStats);

module.exports = router;