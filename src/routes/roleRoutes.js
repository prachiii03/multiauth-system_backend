const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');
const { auth } = require('../middleware/auth');
const { checkPermission } = require('../middleware/permission');

// Debug
console.log('Role controller functions loaded:', Object.keys(roleController));

// Public routes (for registration)
router.get('/permissions', roleController.getAvailablePermissions);
router.get('/public', roleController.getPublicRoles);

// Test route
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Role routes are working!',
    timestamp: new Date().toISOString()
  });
});

// All other routes require authentication
router.use(auth);

// Protected routes
router.post('/', checkPermission('system_management'), roleController.createRole);
router.get('/', checkPermission('view_user'), roleController.getAllRoles);
router.get('/:id', checkPermission('view_user'), roleController.getRoleById);
router.put('/:id', checkPermission('system_management'), roleController.updateRole);
router.delete('/:id', checkPermission('system_management'), roleController.deleteRole);

module.exports = router;