const User = require('../models/User');
const Department = require('../models/Department');
const Role = require('../models/Role');
const bcrypt = require('bcryptjs');

// Get all users with populated department and role
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({})
      .populate('department', 'name code')
      .populate('role', 'name description')
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

// Get single user
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('department')
      .populate('role')
      .select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};

// Create user
exports.createUser = async (req, res) => {
  try {
    const { name, email, password, departmentId, roleId, isActive } = req.body;

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Verify department and role exist
    const department = await Department.findById(departmentId);
    const role = await Role.findById(roleId);

    if (!department) {
      return res.status(400).json({
        success: false,
        message: 'Department not found'
      });
    }

    if (!role) {
      return res.status(400).json({
        success: false,
        message: 'Role not found'
      });
    }

    // Create user
    const user = new User({
      name,
      email,
      password,
      department: departmentId,
      role: roleId,
      isActive: isActive !== undefined ? isActive : true
    });

    await user.save();

    // Update role user count
    await Role.findByIdAndUpdate(roleId, {
      $inc: { userCount: 1 }
    });

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: userResponse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message
    });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { name, email, password, departmentId, roleId, isActive } = req.body;

    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check if email is being changed and if it already exists
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email already exists'
        });
      }
      user.email = email;
    }

    if (name) user.name = name;
    if (departmentId) user.department = departmentId;
    if (roleId) {
      // Update role user counts
      if (user.role.toString() !== roleId) {
        // Decrement old role count
        await Role.findByIdAndUpdate(user.role, {
          $inc: { userCount: -1 }
        });
        // Increment new role count
        await Role.findByIdAndUpdate(roleId, {
          $inc: { userCount: 1 }
        });
      }
      user.role = roleId;
    }
    if (isActive !== undefined) user.isActive = isActive;

    // Update password if provided
    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    await user.save();

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      success: true,
      message: 'User updated successfully',
      data: userResponse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update role user count
    await Role.findByIdAndUpdate(user.role, {
      $inc: { userCount: -1 }
    });

    await user.deleteOne();

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};

// Get user stats
exports.getUserStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const usersByDepartment = await User.aggregate([
      {
        $group: {
          _id: '$department',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'departments',
          localField: '_id',
          foreignField: '_id',
          as: 'department'
        }
      },
      {
        $unwind: '$department'
      },
      {
        $project: {
          departmentName: '$department.name',
          count: 1
        }
      }
    ]);

    const usersByRole = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'roles',
          localField: '_id',
          foreignField: '_id',
          as: 'role'
        }
      },
      {
        $unwind: '$role'
      },
      {
        $project: {
          roleName: '$role.name',
          count: 1
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        inactiveUsers: totalUsers - activeUsers,
        usersByDepartment,
        usersByRole
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user stats',
      error: error.message
    });
  }
};