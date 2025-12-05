const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new Error();
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Find user
    const user = await User.findById(decoded.userId)
      .populate('role')
      .populate('department');

    if (!user || !user.isActive) {
      throw new Error();
    }

    // Get combined permissions
    const rolePermissions = user.role?.permissions || [];
    const departmentPermissions = user.department?.permissions || [];
    const userPermissions = [...new Set([...rolePermissions, ...departmentPermissions])];

    // ✅ FIX: Attach user, permissions with CORRECT property names
    req.user = user;
    req.userPermissions = userPermissions;  // ← Changed from req.permissions
    req.permissions = userPermissions;       // ← Keep both for compatibility
    req.token = token;
    
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Please authenticate' 
    });
  }
};

module.exports = { auth };