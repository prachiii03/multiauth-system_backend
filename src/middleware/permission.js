const { hasPermission, hasAnyPermission, hasAllPermissions } = require('../utils/permissions');

/**
 * Middleware to check if user has a specific permission
 * @param {string} requiredPermission - The permission code required
 * @returns {Function} - Express middleware function
 */
const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    try {
      // Check if user is authenticated
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Get user permissions from request (set by auth middleware)
      const userPermissions = req.userPermissions || req.user.permissions || [];
      
      // Check permission
      const hasAccess = hasPermission(userPermissions, requiredPermission);
      
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required permission: ${requiredPermission}`,
          requiredPermission
        });
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({
        success: false,
        message: 'Permission check failed'
      });
    }
  };
};

/**
 * Middleware to check if user has ANY of the required permissions
 * @param {Array} requiredPermissions - Array of permission codes
 * @returns {Function} - Express middleware function
 */
const checkAnyPermission = (requiredPermissions) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const userPermissions = req.userPermissions || req.user.permissions || [];
      const hasAccess = hasAnyPermission(userPermissions, requiredPermissions);
      
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Insufficient permissions.',
          requiredPermissions
        });
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({
        success: false,
        message: 'Permission check failed'
      });
    }
  };
};

/**
 * Middleware to check if user has ALL of the required permissions
 * @param {Array} requiredPermissions - Array of permission codes
 * @returns {Function} - Express middleware function
 */
const checkAllPermissions = (requiredPermissions) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const userPermissions = req.userPermissions || req.user.permissions || [];
      const hasAccess = hasAllPermissions(userPermissions, requiredPermissions);
      
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Missing some permissions.',
          requiredPermissions
        });
      }

      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({
        success: false,
        message: 'Permission check failed'
      });
    }
  };
};

/**
 * Middleware to check CRUD permissions for a resource
 * @param {string} resource - Resource name (e.g., 'user', 'lead')
 * @param {string} operation - CRUD operation ('create', 'read', 'update', 'delete')
 * @returns {Function} - Express middleware function
 */
const checkCRUDPermission = (resource, operation) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      // Map operation to permission code
      const permissionMap = {
        create: `create_${resource}`,
        read: `view_${resource}`,
        update: `update_${resource}`,
        delete: `delete_${resource}`
      };

      const requiredPermission = permissionMap[operation];
      if (!requiredPermission) {
        return res.status(400).json({
          success: false,
          message: `Invalid operation: ${operation}`
        });
      }

      const userPermissions = req.userPermissions || req.user.permissions || [];
      const hasAccess = hasPermission(userPermissions, requiredPermission);
      
      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Cannot ${operation} ${resource}.`,
          requiredPermission
        });
      }

      next();
    } catch (error) {
      console.error('CRUD permission check error:', error);
      res.status(500).json({
        success: false,
        message: 'Permission check failed'
      });
    }
  };
};

/**
 * Dynamic permission middleware factory
 * @param {string} permission - Permission code or array of codes
 * @param {Object} options - Options { any: boolean, all: boolean }
 * @returns {Function} - Express middleware function
 */
const requirePermission = (permission, options = {}) => {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required'
        });
      }

      const userPermissions = req.userPermissions || req.user.permissions || [];
      let hasAccess = false;

      if (Array.isArray(permission)) {
        if (options.all) {
          hasAccess = hasAllPermissions(userPermissions, permission);
        } else {
          // Default to "any" if multiple permissions provided
          hasAccess = hasAnyPermission(userPermissions, permission);
        }
      } else {
        hasAccess = hasPermission(userPermissions, permission);
      }

      if (!hasAccess) {
        return res.status(403).json({
          success: false,
          message: 'Access denied. Insufficient permissions.'
        });
      }

      next();
    } catch (error) {
      console.error('Permission middleware error:', error);
      res.status(500).json({
        success: false,
        message: 'Permission check failed'
      });
    }
  };
};

module.exports = {
  checkPermission,
  checkAnyPermission,
  checkAllPermissions,
  checkCRUDPermission,
  requirePermission
};