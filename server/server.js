const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const seedData = require('./utils/seeder');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://unique-lokum-c8f87d.netlify.app',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        origin.endsWith('.netlify.app') ||
        process.env.FRONTEND_URL === origin
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// Health check endpoints
app.get('/', (req, res) => {
  res.status(200).json({
    status: 'Active',
    system: 'BloodLink Backend API',
    endpoints: {
      status: '/api/status',
      auth: '/api/auth',
      donors: '/api/donors',
      requests: '/api/requests',
    },
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Connect Database & Seed initial data
connectDB().then(async () => {
  await seedData();
});

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.get('/api/donors', require('./controllers/userController').getDonors);
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/donations', require('./routes/donationRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Root Status Route
app.get('/api/status', (req, res) => {
  res.status(200).json({
    status: 'Active',
    system: 'BloodLink: Online Blood Donation and Emergency Donor Management System',
    timestamp: new Date().toISOString(),
  });
});

// Error Handler Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`=============================================================`);
  console.log(`🩸 BloodLink Backend Server running on port ${PORT}`);
  console.log(`📡 Base API URL: http://localhost:${PORT}/api`);
  console.log(`=============================================================`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error(`Error: ${err.message}`);
});
