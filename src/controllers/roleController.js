const Role = require('../models/Role');
const User = require('../models/User');

// Get available permissions
exports.getAvailablePermissions = async (req, res) => {
  try {
    const permissions = {
      user: [
        { code: 'create_user', name: 'Create Users' },
        { code: 'view_user', name: 'View Users' },
        { code: 'update_user', name: 'Update Users' },
        { code: 'delete_user', name: 'Delete Users' }
      ],
      lead: [
        { code: 'create_lead', name: 'Create Leads' },
        { code: 'view_lead', name: 'View Leads' },
        { code: 'update_lead', name: 'Update Leads' },
        { code: 'delete_lead', name: 'Delete Leads' }
      ],
      property: [
        { code: 'create_property', name: 'Create Properties' },
        { code: 'view_property', name: 'View Properties' },
        { code: 'update_property', name: 'Update Properties' },
        { code: 'delete_property', name: 'Delete Properties' }
      ],
      activity: [
        { code: 'create_activity', name: 'Create Activities' },
        { code: 'view_activity', name: 'View Activities' },
        { code: 'update_activity', name: 'Update Activities' },
        { code: 'delete_activity', name: 'Delete Activities' }
      ],
      system: [
        { code: 'system_management', name: 'System Management' }
      ],
      report: [
        { code: 'view_reports', name: 'View Reports' }
      ],
      data: [
        { code: 'export_data', name: 'Export Data' },
        { code: 'import_data', name: 'Import Data' }
      ]
    };

    res.json({
      success: true,
      data: permissions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching permissions',
      error: error.message
    });
  }
};

// Get public roles (no authentication required)
exports.getPublicRoles = async (req, res) => {
  try {
    const roles = await Role.find({})
      .select('_id name description')
      .sort({ name: 1 });

    res.json({
      success: true,
      data: roles
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching roles',
      error: error.message
    });
  }
};

// Create a new role
exports.createRole = async (req, res) => {
  try {
    const { name, description, permissions } = req.body;

    // Check if role already exists
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({
        success: false,
        message: 'Role with this name already exists'
      });
    }

    // Create new role
    const role = new Role({
      name,
      description,
      permissions
    });

    await role.save();

    res.status(201).json({
      success: true,
      message: 'Role created successfully',
      data: role
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating role',
      error: error.message
    });
  }
};

// Get all roles
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find({})
      .sort({ createdAt: -1 })
      .lean();

    // Get user count for each role
    const rolesWithCounts = await Promise.all(
      roles.map(async (role) => {
        const userCount = await User.countDocuments({ role: role._id });
        return {
          ...role,
          userCount,
          permissionCount: role.permissions ? role.permissions.length : 0
        };
      })
    );

    res.json({
      success: true,
      data: rolesWithCounts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching roles',
      error: error.message
    });
  }
};

// Get single role
exports.getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    const userCount = await User.countDocuments({ role: role._id });

    res.json({
      success: true,
      data: {
        ...role.toObject(),
        userCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching role',
      error: error.message
    });
  }
};

// Update role
exports.updateRole = async (req, res) => {
  try {
    const { name, description, permissions } = req.body;

    const role = await Role.findById(req.params.id);
    
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    // Check if name is being changed and if it already exists
    if (name && name !== role.name) {
      const existingRole = await Role.findOne({ name });
      if (existingRole) {
        return res.status(400).json({
          success: false,
          message: 'Role with this name already exists'
        });
      }
      role.name = name;
    }

    if (description) role.description = description;
    if (permissions) role.permissions = permissions;

    await role.save();

    res.json({
      success: true,
      message: 'Role updated successfully',
      data: role
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating role',
      error: error.message
    });
  }
};

// Delete role
exports.deleteRole = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    // Check if role has users
    const userCount = await User.countDocuments({ role: role._id });
    if (userCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete role with assigned users'
      });
    }

    await role.deleteOne();

    res.json({
      success: true,
      message: 'Role deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting role',
      error: error.message
    });
  }
};