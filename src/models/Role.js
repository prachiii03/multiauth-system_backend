const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  permissions: [{
    type: String,
    enum: [
      // User Permissions
      'create_user', 'view_user', 'update_user', 'delete_user',
      // Lead Permissions
      'create_lead', 'view_lead', 'update_lead', 'delete_lead',
      // Property Permissions
      'create_property', 'view_property', 'update_property', 'delete_property',
      // Activity Permissions
      'create_activity', 'view_activity', 'update_activity', 'delete_activity',
      // System Permissions
      'system_management',
      // Report Permissions
      'view_reports',
      // Data Permissions
      'export_data', 'import_data'
    ]
  }],
  isDefault: {
    type: Boolean,
    default: false
  },
  userCount: {
    type: Number,
    default: 0
  },
  permissionCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate permission count before save
roleSchema.pre('save', function(next) {
  this.permissionCount = this.permissions.length;
  next();
});

module.exports = mongoose.model('Role', roleSchema);