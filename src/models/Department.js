const mongoose = require('mongoose');

const departmentSchema = new mongoose.Schema({
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
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
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
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Department', departmentSchema);