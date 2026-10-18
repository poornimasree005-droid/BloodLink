const mongoose = require('mongoose');

// Lifecycle event listeners
mongoose.connection.on('connected', () => {
  console.log('[Database] Mongoose status: Connected');
});
mongoose.connection.on('error', (err) => {
  console.error('[Database] Mongoose status error:', err.message);
});
mongoose.connection.on('disconnected', () => {
  console.warn('[Database] Mongoose status: Disconnected');
});

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  const isProduction = process.env.NODE_ENV === 'production';

  // In production on Render, reject localhost/127.0.0.1 immediately with clear guidance
  if (isProduction && mongoUri && (mongoUri.includes('127.0.0.1') || mongoUri.includes('localhost'))) {
    global.__dbConnectionError = 'In production on Render, MONGO_URI cannot be localhost (127.0.0.1). Please configure your cloud MongoDB Atlas connection string (mongodb+srv://...) in Render environment variables.';
    console.error(`[Database] Configuration Error: ${global.__dbConnectionError}`);
    return null;
  }

  if (mongoUri) {
    try {
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 10000,
      });
      const isCloud = !mongoUri.includes('127.0.0.1') && !mongoUri.includes('localhost');
      const hostDesc = isCloud ? 'Cloud MongoDB Atlas' : 'Local MongoDB';
      console.log(`[Database] ${hostDesc} Connected: ${conn.connection.host}`);
      global.__dbConnectionError = null;
      global.__dbMode = hostDesc;
      return conn;
    } catch (error) {
      console.error(`[Database] MongoDB connection error for MONGO_URI: ${error.message}`);
      global.__dbConnectionError = error.message;
    }
  } else {
    global.__dbConnectionError = 'MONGO_URI environment variable is not configured in Render environment variables.';
    console.warn('[Database] Warning: MONGO_URI is not set in environment variables.');
  }

  // In non-production local development, fallback to local MongoDB service if MONGO_URI was not set
  if (process.env.NODE_ENV !== 'production') {
    try {
      const conn = await mongoose.connect('mongodb://127.0.0.1:27017/bloodlink', {
        serverSelectionTimeoutMS: 2500,
      });
      console.log(`[Database] Local Development MongoDB Connected: ${conn.connection.host}`);
      global.__dbConnectionError = null;
      global.__dbMode = 'Local MongoDB (Development)';
      return conn;
    } catch (error) {
      console.warn(`[Database] Local MongoDB not available: ${error.message}`);
    }
  }

  return null;
};

module.exports = connectDB;
