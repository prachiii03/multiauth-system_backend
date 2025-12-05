require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Department = require('../models/Department');
const Role = require('../models/Role');
const User = require('../models/User');

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🔗 Connected to MongoDB for seeding');

    // Clear existing data
    await Department.deleteMany({});
    await Role.deleteMany({});
    await User.deleteMany({});
    console.log('🧹 Cleared existing data');

    // Create Departments
    const departments = [
      {
        name: 'Administration',
        code: 'ADMIN',
        description: 'System administration department',
        permissions: [
          'create_user', 'view_user', 'update_user', 'delete_user',
          'create_lead', 'view_lead', 'update_lead', 'delete_lead',
          'create_property', 'view_property', 'update_property', 'delete_property',
          'create_activity', 'view_activity', 'update_activity', 'delete_activity',
          'system_management', 'view_reports', 'export_data', 'import_data'
        ]
      },
      {
        name: 'Sales',
        code: 'SALES',
        description: 'Sales department',
        permissions: [
          'view_user', 'create_lead', 'view_lead', 'update_lead',
          'create_property', 'view_property', 'update_property',
          'create_activity', 'view_activity', 'update_activity',
          'view_reports', 'export_data'
        ]
      },
      {
        name: 'Marketing',
        code: 'MARKETING',
        description: 'Marketing department',
        permissions: [
          'view_user', 'create_lead', 'view_lead', 'update_lead',
          'view_property', 'create_activity', 'view_activity',
          'view_reports'
        ]
      }
    ];

    const createdDepartments = await Department.insertMany(departments);
    console.log('✅ Created departments');

    // Create Roles
    const roles = [
      {
        name: 'Admin',
        description: 'Full administrative access',
        permissions: [
          'create_user', 'view_user', 'update_user', 'delete_user',
          'create_lead', 'view_lead', 'update_lead', 'delete_lead',
          'create_property', 'view_property', 'update_property', 'delete_property',
          'create_activity', 'view_activity', 'update_activity', 'delete_activity',
          'system_management', 'view_reports', 'export_data', 'import_data'
        ],
        isDefault: true
      },
      {
        name: 'Manager',
        description: 'Team management & oversight',
        permissions: [
          'create_user', 'view_user', 'update_user',
          'create_lead', 'view_lead', 'update_lead', 'delete_lead',
          'create_property', 'view_property', 'update_property',
          'create_activity', 'view_activity', 'update_activity',
          'view_reports', 'export_data'
        ]
      },
      {
        name: 'Agent',
        description: 'Sales agent with lead & property management',
        permissions: [
          'view_user',
          'create_lead', 'view_lead', 'update_lead',
          'create_property', 'view_property', 'update_property',
          'create_activity', 'view_activity', 'update_activity'
        ]
      },
      {
        name: 'Seller',
        description: 'Property owners who list properties',
        permissions: [
          'create_property', 'view_property', 'update_property',
          'create_activity', 'view_activity', 'update_activity'
        ]
      },
      {
        name: 'Buyer',
        description: 'Property buyers with limited access',
        permissions: [
          'view_property',
          'create_activity', 'view_activity'
        ]
      }
    ];

    const createdRoles = await Role.insertMany(roles);
    console.log('✅ Created roles');

    // Create Admin User
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    const adminUser = new User({
      name: 'System Administrator',
      email: 'admin@example.com',
      password: hashedPassword,
      department: createdDepartments[0]._id,
      role: createdRoles[0]._id
    });

    await adminUser.save();
    
    // Update role user count
    await Role.findByIdAndUpdate(createdRoles[0]._id, {
      $inc: { userCount: 1 }
    });

    console.log('✅ Created admin user:');
    console.log('   Email: admin@example.com');
    console.log('   Password: admin123');
    console.log('\n🎉 Database seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
};

// Run seeding
seedDatabase();