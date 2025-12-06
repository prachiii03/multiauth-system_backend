// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const helmet = require('helmet');
// const morgan = require('morgan');
// require('dotenv').config();

// // Import routes
// const authRoutes = require('./routes/authRoutes');
// const roleRoutes = require('./routes/roleRoutes');
// const userRoutes = require('./routes/userRoutes');
// const departmentRoutes = require('./routes/departmentRoutes');

// const app = express();

// // Middleware
// app.use(helmet());
// app.use(cors({
//   origin: process.env.FRONTEND_URL || 'http://localhost:3000',
//   credentials: true
// }));
// app.use(morgan('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Database connection
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })
// .then(() => console.log('✅ MongoDB connected successfully'))
// .catch(err => console.error('❌ MongoDB connection error:', err));

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/roles', roleRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/departments', departmentRoutes);

// // Health check
// app.get('/health', (req, res) => {
//   res.json({ 
//     status: 'OK', 
//     timestamp: new Date().toISOString(),
//     service: 'Role Permission System API'
//   });
// });

// // Test route
// app.get('/api/test', (req, res) => {
//   res.json({ 
//     success: true, 
//     message: 'API is working!',
//     timestamp: new Date().toISOString()
//   });
// });

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({
//     success: false,
//     message: 'Something went wrong!',
//     error: process.env.NODE_ENV === 'development' ? err.message : undefined
//   });
// });

// // 404 handler
// app.use('*', (req, res) => {
//   res.status(404).json({
//     success: false,
//     message: 'Route not found'
//   });
// });

// const PORT = process.env.PORT || 5000;

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`);
//   console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
//   console.log(`🔗 Health check: http://localhost:${PORT}/health`);
//   console.log(`🔗 API test: http://localhost:${PORT}/api/test`);
// });

// module.exports = app;




// File: backend/src/server.js
// Updated for Vercel Serverless Deployment

// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const helmet = require('helmet');
// const morgan = require('morgan');
// require('dotenv').config();

// // Import routes
// const authRoutes = require('./routes/authRoutes');
// const roleRoutes = require('./routes/roleRoutes');
// const userRoutes = require('./routes/userRoutes');
// const departmentRoutes = require('./routes/departmentRoutes');

// const app = express();

// // Middleware
// app.use(
//   helmet({
//     contentSecurityPolicy: false,
//     crossOriginEmbedderPolicy: false,
//   })
// );

// // CORS
// const allowedOrigins = [
//   process.env.FRONTEND_URL,
//   'http://localhost:3000',
//   'https://your-frontend.vercel.app', // replace with your frontend URL
// ];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       if (!origin) return callback(null, true);
//       if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
//         callback(null, true);
//       } else {
//         callback(new Error('Not allowed by CORS'));
//       }
//     },
//     credentials: true,
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     allowedHeaders: ['Content-Type', 'Authorization'],
//   })
// );

// app.use(morgan('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // MongoDB connection
// let cachedDb = null;
// async function connectToDatabase() {
//   if (cachedDb) return cachedDb;

//   try {
//     const connection = await mongoose.connect(process.env.MONGODB_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });

//     cachedDb = connection;
//     console.log('✅ MongoDB connected successfully');
//     return connection;
//   } catch (err) {
//     console.error('❌ MongoDB connection error:', err);
//     throw err;
//   }
// }

// // Initialize DB connection
// connectToDatabase();

// // Routes
// app.use('/api/auth', authRoutes);
// app.use('/api/roles', roleRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/departments', departmentRoutes);

// // Health check
// app.get('/api/health', (req, res) => {
//   res.json({
//     status: 'OK',
//     mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
//   });
// });

// // Root
// app.get('/', (req, res) => {
//   res.json({
//     success: true,
//     message: 'Role Permission System API',
//     version: '1.0.0',
//     endpoints: {
//       health: '/api/health',
//       auth: '/api/auth',
//       roles: '/api/roles',
//       users: '/api/users',
//       departments: '/api/departments',
//     },
//   });
// });

// // Test
// app.get('/api/test', (req, res) => {
//   res.json({
//     success: true,
//     message: 'API is working!',
//   });
// });

// // Error handling
// app.use((err, req, res, next) => {
//   console.error('Error:', err.stack);
//   res.status(err.status || 500).json({
//     success: false,
//     message: err.message || 'Something went wrong!',
//   });
// });

// // 404 handler
// app.use('*', (req, res) => {
//   res.status(404).json({
//     success: false,
//     message: `Route ${req.originalUrl} not found`,
//     availableRoutes: ['/api/auth/*', '/api/roles/*', '/api/users/*', '/api/departments/*', '/api/health'],
//   });
// });

// module.exports = app;












const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const roleRoutes = require('./routes/roleRoutes');
const userRoutes = require('./routes/userRoutes');
const departmentRoutes = require('./routes/departmentRoutes');

const app = express();

// Middleware
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// CORS - Allow multiple origins
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'https://multiauth-system-frontend.vercel.app/' // Will update this later
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all for now
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection with caching for serverless
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    console.log('Using cached database connection');
    return cachedDb;
  }

  try {
    console.log('Creating new database connection...');
    const connection = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });

    cachedDb = connection;
    console.log('✅ MongoDB connected successfully');
    return connection;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    throw err;
  }
}

// Initialize connection
connectToDatabase();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/users', userRoutes);
app.use('/api/departments', departmentRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Role Permission System API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      roles: '/api/roles',
      users: '/api/users',
      departments: '/api/departments'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Role Permission System API',
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Test route
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    console.log(`🔗 API test: http://localhost:${PORT}/api/test`);
  });
}

// Export for Vercel
module.exports = app;