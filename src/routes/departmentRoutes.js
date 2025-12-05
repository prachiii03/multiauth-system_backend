const express = require('express');
const router = express.Router();
const departmentController = require('../controllers/departmentController');
const { auth } = require('../middleware/auth');
const { checkPermission } = require('../middleware/permission');

// Debug
console.log('Department controller functions loaded:', Object.keys(departmentController));

// Test route
router.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Department routes are working!',
    timestamp: new Date().toISOString()
  });
});

// PUBLIC ROUTES (for registration)
router.get('/public', departmentController.getPublicDepartments);

// All other department routes require authentication
router.use(auth);

// Protected routes
router.post('/', checkPermission('system_management'), departmentController.createDepartment);
router.get('/', checkPermission('view_user'), departmentController.getAllDepartments);
router.get('/:id', checkPermission('view_user'), departmentController.getDepartmentById);
router.put('/:id', checkPermission('system_management'), departmentController.updateDepartment);
router.delete('/:id', checkPermission('system_management'), departmentController.deleteDepartment);
router.get('/:id/permissions', checkPermission('view_user'), departmentController.getDepartmentPermissions);

module.exports = router;