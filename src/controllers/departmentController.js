const Department = require('../models/Department');
const User = require('../models/User');

// Get public departments (no authentication required)
exports.getPublicDepartments = async (req, res) => {
  try {
    const departments = await Department.find({ isActive: true })
      .select('_id name code description')
      .sort({ name: 1 });

    res.json({
      success: true,
      data: departments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching departments',
      error: error.message
    });
  }
};

// Create a new department
exports.createDepartment = async (req, res) => {
  try {
    const { name, description, code, permissions } = req.body;

    // Check if department already exists
    const existingDept = await Department.findOne({ $or: [{ name }, { code }] });
    if (existingDept) {
      return res.status(400).json({
        success: false,
        message: 'Department with this name or code already exists'
      });
    }

    // Create new department
    const department = new Department({
      name,
      description,
      code: code.toUpperCase(),
      permissions: permissions || []
    });

    await department.save();

    res.status(201).json({
      success: true,
      message: 'Department created successfully',
      data: department
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating department',
      error: error.message
    });
  }
};

// Get all departments
exports.getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.find({})
      .sort({ createdAt: -1 })
      .lean();

    // Get user count for each department
    const departmentsWithCounts = await Promise.all(
      departments.map(async (dept) => {
        const userCount = await User.countDocuments({ department: dept._id });
        return {
          ...dept,
          userCount
        };
      })
    );

    res.json({
      success: true,
      data: departmentsWithCounts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching departments',
      error: error.message
    });
  }
};

// Get single department
exports.getDepartmentById = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    const userCount = await User.countDocuments({ department: department._id });

    res.json({
      success: true,
      data: {
        ...department.toObject(),
        userCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching department',
      error: error.message
    });
  }
};

// Update department
exports.updateDepartment = async (req, res) => {
  try {
    const { name, description, code, permissions, isActive } = req.body;

    const department = await Department.findById(req.params.id);
    
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    // Check if name or code is being changed and if they already exist
    if (name && name !== department.name) {
      const existingDept = await Department.findOne({ name });
      if (existingDept) {
        return res.status(400).json({
          success: false,
          message: 'Department with this name already exists'
        });
      }
      department.name = name;
    }

    if (code && code !== department.code) {
      const existingDept = await Department.findOne({ code });
      if (existingDept) {
        return res.status(400).json({
          success: false,
          message: 'Department with this code already exists'
        });
      }
      department.code = code.toUpperCase();
    }

    if (description !== undefined) department.description = description;
    if (permissions !== undefined) department.permissions = permissions;
    if (isActive !== undefined) department.isActive = isActive;

    await department.save();

    res.json({
      success: true,
      message: 'Department updated successfully',
      data: department
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating department',
      error: error.message
    });
  }
};

// Delete department
exports.deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    // Check if department has users
    const userCount = await User.countDocuments({ department: department._id });
    if (userCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete department with assigned users'
      });
    }

    await department.deleteOne();

    res.json({
      success: true,
      message: 'Department deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting department',
      error: error.message
    });
  }
};

// Get department permissions
exports.getDepartmentPermissions = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);
    
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found'
      });
    }

    res.json({
      success: true,
      data: department.permissions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching department permissions',
      error: error.message
    });
  }
};