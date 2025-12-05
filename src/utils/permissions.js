/**
 * Permission Utility Functions
 * Centralized permission checking and management
 */

// All available permissions in the system
const ALL_PERMISSIONS = {
  // User Management
  USER: {
    CREATE: 'create_user',
    VIEW: 'view_user',
    UPDATE: 'update_user',
    DELETE: 'delete_user'
  },
  
  // Lead Management
  LEAD: {
    CREATE: 'create_lead',
    VIEW: 'view_lead',
    UPDATE: 'update_lead',
    DELETE: 'delete_lead'
  },
  
  // Property Management
  PROPERTY: {
    CREATE: 'create_property',
    VIEW: 'view_property',
    UPDATE: 'update_property',
    DELETE: 'delete_property'
  },
  
  // Activity Management
  ACTIVITY: {
    CREATE: 'create_activity',
    VIEW: 'view_activity',
    UPDATE: 'update_activity',
    DELETE: 'delete_activity'
  },
  
  // System Management
  SYSTEM: {
    MANAGEMENT: 'system_management'
  },
  
  // Reports
  REPORT: {
    VIEW: 'view_reports'
  },
  
  // Data Management
  DATA: {
    EXPORT: 'export_data',
    IMPORT: 'import_data'
  }
};

// Permission groups for UI display
const PERMISSION_GROUPS = [
  {
    name: 'User Management',
    key: 'user',
    permissions: [
      { code: ALL_PERMISSIONS.USER.CREATE, name: 'Create Users' },
      { code: ALL_PERMISSIONS.USER.VIEW, name: 'View Users' },
      { code: ALL_PERMISSIONS.USER.UPDATE, name: 'Update Users' },
      { code: ALL_PERMISSIONS.USER.DELETE, name: 'Delete Users' }
    ]
  },
  {
    name: 'Lead Management',
    key: 'lead',
    permissions: [
      { code: ALL_PERMISSIONS.LEAD.CREATE, name: 'Create Leads' },
      { code: ALL_PERMISSIONS.LEAD.VIEW, name: 'View Leads' },
      { code: ALL_PERMISSIONS.LEAD.UPDATE, name: 'Update Leads' },
      { code: ALL_PERMISSIONS.LEAD.DELETE, name: 'Delete Leads' }
    ]
  },
  {
    name: 'Property Management',
    key: 'property',
    permissions: [
      { code: ALL_PERMISSIONS.PROPERTY.CREATE, name: 'Create Properties' },
      { code: ALL_PERMISSIONS.PROPERTY.VIEW, name: 'View Properties' },
      { code: ALL_PERMISSIONS.PROPERTY.UPDATE, name: 'Update Properties' },
      { code: ALL_PERMISSIONS.PROPERTY.DELETE, name: 'Delete Properties' }
    ]
  },
  {
    name: 'Activity Management',
    key: 'activity',
    permissions: [
      { code: ALL_PERMISSIONS.ACTIVITY.CREATE, name: 'Create Activities' },
      { code: ALL_PERMISSIONS.ACTIVITY.VIEW, name: 'View Activities' },
      { code: ALL_PERMISSIONS.ACTIVITY.UPDATE, name: 'Update Activities' },
      { code: ALL_PERMISSIONS.ACTIVITY.DELETE, name: 'Delete Activities' }
    ]
  },
  {
    name: 'System Management',
    key: 'system',
    permissions: [
      { code: ALL_PERMISSIONS.SYSTEM.MANAGEMENT, name: 'System Management' }
    ]
  },
  {
    name: 'Reports',
    key: 'report',
    permissions: [
      { code: ALL_PERMISSIONS.REPORT.VIEW, name: 'View Reports' }
    ]
  },
  {
    name: 'Data Management',
    key: 'data',
    permissions: [
      { code: ALL_PERMISSIONS.DATA.EXPORT, name: 'Export Data' },
      { code: ALL_PERMISSIONS.DATA.IMPORT, name: 'Import Data' }
    ]
  }
];

// Predefined roles with their permissions
const PREDEFINED_ROLES = {
  ADMIN: {
    name: 'Admin',
    description: 'Full system administrator access',
    permissions: Object.values(ALL_PERMISSIONS).flatMap(group => 
      Object.values(group)
    )
  },
  MANAGER: {
    name: 'Manager',
    description: 'Team management and oversight',
    permissions: [
      ALL_PERMISSIONS.USER.CREATE,
      ALL_PERMISSIONS.USER.VIEW,
      ALL_PERMISSIONS.USER.UPDATE,
      ALL_PERMISSIONS.LEAD.CREATE,
      ALL_PERMISSIONS.LEAD.VIEW,
      ALL_PERMISSIONS.LEAD.UPDATE,
      ALL_PERMISSIONS.LEAD.DELETE,
      ALL_PERMISSIONS.PROPERTY.CREATE,
      ALL_PERMISSIONS.PROPERTY.VIEW,
      ALL_PERMISSIONS.PROPERTY.UPDATE,
      ALL_PERMISSIONS.ACTIVITY.CREATE,
      ALL_PERMISSIONS.ACTIVITY.VIEW,
      ALL_PERMISSIONS.ACTIVITY.UPDATE,
      ALL_PERMISSIONS.REPORT.VIEW,
      ALL_PERMISSIONS.DATA.EXPORT
    ]
  },
  AGENT: {
    name: 'Agent',
    description: 'Sales agent with lead & property management',
    permissions: [
      ALL_PERMISSIONS.USER.VIEW,
      ALL_PERMISSIONS.LEAD.CREATE,
      ALL_PERMISSIONS.LEAD.VIEW,
      ALL_PERMISSIONS.LEAD.UPDATE,
      ALL_PERMISSIONS.PROPERTY.CREATE,
      ALL_PERMISSIONS.PROPERTY.VIEW,
      ALL_PERMISSIONS.PROPERTY.UPDATE,
      ALL_PERMISSIONS.ACTIVITY.CREATE,
      ALL_PERMISSIONS.ACTIVITY.VIEW,
      ALL_PERMISSIONS.ACTIVITY.UPDATE
    ]
  },
  SELLER: {
    name: 'Seller',
    description: 'Property owners who list properties',
    permissions: [
      ALL_PERMISSIONS.PROPERTY.CREATE,
      ALL_PERMISSIONS.PROPERTY.VIEW,
      ALL_PERMISSIONS.PROPERTY.UPDATE,
      ALL_PERMISSIONS.ACTIVITY.CREATE,
      ALL_PERMISSIONS.ACTIVITY.VIEW,
      ALL_PERMISSIONS.ACTIVITY.UPDATE
    ]
  },
  BUYER: {
    name: 'Buyer',
    description: 'Property buyers with limited access',
    permissions: [
      ALL_PERMISSIONS.PROPERTY.VIEW,
      ALL_PERMISSIONS.ACTIVITY.CREATE,
      ALL_PERMISSIONS.ACTIVITY.VIEW
    ]
  }
};

/**
 * Check if a user has a specific permission
 * @param {Array} userPermissions - Array of permission codes the user has
 * @param {string} requiredPermission - The permission code to check
 * @returns {boolean} - True if user has the permission
 */
const hasPermission = (userPermissions, requiredPermission) => {
  if (!userPermissions || !Array.isArray(userPermissions)) {
    return false;
  }
  return userPermissions.includes(requiredPermission);
};

/**
 * Check if user has any of the required permissions
 * @param {Array} userPermissions - Array of permission codes the user has
 * @param {Array} requiredPermissions - Array of permission codes to check
 * @returns {boolean} - True if user has any of the permissions
 */
const hasAnyPermission = (userPermissions, requiredPermissions) => {
  if (!userPermissions || !Array.isArray(userPermissions)) {
    return false;
  }
  if (!requiredPermissions || !Array.isArray(requiredPermissions)) {
    return false;
  }
  return requiredPermissions.some(permission => 
    userPermissions.includes(permission)
  );
};

/**
 * Check if user has all of the required permissions
 * @param {Array} userPermissions - Array of permission codes the user has
 * @param {Array} requiredPermissions - Array of permission codes to check
 * @returns {boolean} - True if user has all of the permissions
 */
const hasAllPermissions = (userPermissions, requiredPermissions) => {
  if (!userPermissions || !Array.isArray(userPermissions)) {
    return false;
  }
  if (!requiredPermissions || !Array.isArray(requiredPermissions)) {
    return false;
  }
  return requiredPermissions.every(permission => 
    userPermissions.includes(permission)
  );
};

/**
 * Get combined permissions from role and department
 * @param {Object} role - Role object with permissions array
 * @param {Object} department - Department object with permissions array
 * @returns {Array} - Combined unique permissions
 */
const getCombinedPermissions = (role, department) => {
  const rolePermissions = role?.permissions || [];
  const departmentPermissions = department?.permissions || [];
  
  // Combine and remove duplicates
  return [...new Set([...rolePermissions, ...departmentPermissions])];
};

/**
 * Filter data based on user permissions
 * @param {Array} data - Data to filter
 * @param {Array} userPermissions - User's permissions
 * @param {Object} permissionMap - Map of data field to required permission
 * @returns {Array} - Filtered data
 */
const filterDataByPermissions = (data, userPermissions, permissionMap) => {
  if (!data || !Array.isArray(data)) {
    return [];
  }
  
  return data.filter(item => {
    // Check if user has permission for each field
    for (const [field, requiredPermission] of Object.entries(permissionMap)) {
      if (item[field] !== undefined && !hasPermission(userPermissions, requiredPermission)) {
        return false;
      }
    }
    return true;
  });
};

/**
 * Get permission description by code
 * @param {string} permissionCode - Permission code
 * @returns {string} - Permission description
 */
const getPermissionDescription = (permissionCode) => {
  for (const group of PERMISSION_GROUPS) {
    const permission = group.permissions.find(p => p.code === permissionCode);
    if (permission) {
      return permission.name;
    }
  }
  return permissionCode;
};

/**
 * Get permission group by code
 * @param {string} permissionCode - Permission code
 * @returns {Object} - Permission group object
 */
const getPermissionGroup = (permissionCode) => {
  return PERMISSION_GROUPS.find(group => 
    group.permissions.some(p => p.code === permissionCode)
  );
};

/**
 * Validate permission codes
 * @param {Array} permissions - Array of permission codes to validate
 * @returns {Object} - Validation result { isValid: boolean, invalidCodes: Array }
 */
const validatePermissions = (permissions) => {
  if (!permissions || !Array.isArray(permissions)) {
    return { isValid: false, invalidCodes: [], error: 'Permissions must be an array' };
  }
  
  // Get all valid permission codes
  const allValidPermissions = PERMISSION_GROUPS.flatMap(group => 
    group.permissions.map(p => p.code)
  );
  
  const invalidCodes = permissions.filter(code => 
    !allValidPermissions.includes(code)
  );
  
  return {
    isValid: invalidCodes.length === 0,
    invalidCodes,
    validCount: permissions.length - invalidCodes.length,
    invalidCount: invalidCodes.length
  };
};

/**
 * Get all permission codes as a flat array
 * @returns {Array} - All permission codes
 */
const getAllPermissionCodes = () => {
  return PERMISSION_GROUPS.flatMap(group => 
    group.permissions.map(p => p.code)
  );
};

/**
 * Format permissions for UI display
 * @param {Array} permissionCodes - Array of permission codes
 * @returns {Array} - Formatted permissions with name and group
 */
const formatPermissionsForUI = (permissionCodes) => {
  return permissionCodes.map(code => {
    const group = getPermissionGroup(code);
    return {
      code,
      name: getPermissionDescription(code),
      group: group ? group.name : 'Other'
    };
  }).sort((a, b) => a.group.localeCompare(b.group));
};

/**
 * Check if permission allows create operation
 * @param {string} permissionCode - Permission code
 * @returns {boolean} - True if it's a create permission
 */
const isCreatePermission = (permissionCode) => {
  return permissionCode.startsWith('create_');
};

/**
 * Check if permission allows read operation
 * @param {string} permissionCode - Permission code
 * @returns {boolean} - True if it's a view/read permission
 */
const isReadPermission = (permissionCode) => {
  return permissionCode.startsWith('view_');
};

/**
 * Check if permission allows update operation
 * @param {string} permissionCode - Permission code
 * @returns {boolean} - True if it's an update permission
 */
const isUpdatePermission = (permissionCode) => {
  return permissionCode.startsWith('update_');
};

/**
 * Check if permission allows delete operation
 * @param {string} permissionCode - Permission code
 * @returns {boolean} - True if it's a delete permission
 */
const isDeletePermission = (permissionCode) => {
  return permissionCode.startsWith('delete_');
};

/**
 * Get CRUD permissions for a specific resource
 * @param {string} resource - Resource name (e.g., 'user', 'lead')
 * @returns {Object} - Object with create, read, update, delete permissions
 */
const getCRUDPermissions = (resource) => {
  return {
    create: `create_${resource}`,
    read: `view_${resource}`,
    update: `update_${resource}`,
    delete: `delete_${resource}`
  };
};

/**
 * Check if user has CRUD permissions for a resource
 * @param {Array} userPermissions - User's permissions
 * @param {string} resource - Resource name
 * @returns {Object} - Object with boolean values for each CRUD operation
 */
const checkCRUDPermissions = (userPermissions, resource) => {
  const crud = getCRUDPermissions(resource);
  return {
    canCreate: hasPermission(userPermissions, crud.create),
    canRead: hasPermission(userPermissions, crud.read),
    canUpdate: hasPermission(userPermissions, crud.update),
    canDelete: hasPermission(userPermissions, crud.delete)
  };
};

module.exports = {
  // Constants
  ALL_PERMISSIONS,
  PERMISSION_GROUPS,
  PREDEFINED_ROLES,
  
  // Permission checking functions
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  
  // Permission management functions
  getCombinedPermissions,
  filterDataByPermissions,
  getPermissionDescription,
  getPermissionGroup,
  validatePermissions,
  getAllPermissionCodes,
  formatPermissionsForUI,
  
  // Permission type checking
  isCreatePermission,
  isReadPermission,
  isUpdatePermission,
  isDeletePermission,
  
  // CRUD utilities
  getCRUDPermissions,
  checkCRUDPermissions
};