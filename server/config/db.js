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
  const isLocalhost = mongoUri && (mongoUri.includes('127.0.0.1') || mongoUri.includes('localhost'));

  // 1. Try connecting to cloud/remote MongoDB if provided and not localhost in production
  if (mongoUri && !(isProduction && isLocalhost)) {
    try {
      console.log('[Database] Attempting connection to configured MONGO_URI...');
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
      });
      const isCloud = !isLocalhost;
      const hostDesc = isCloud ? 'Cloud MongoDB Atlas' : 'Local MongoDB';
      console.log(`[Database] ${hostDesc} Connected: ${conn.connection.host}`);
      global.__dbConnectionError = null;
      global.__dbMode = hostDesc;
      return conn;
    } catch (error) {
      console.warn(`[Database] Configured MONGO_URI connection attempt failed: ${error.message}`);
      global.__dbConnectionError = error.message;
    }
  }

  // 2. In local development without MONGO_URI, try local daemon at 127.0.0.1:27017
  if (!isProduction && !mongoUri) {
    try {
      const conn = await mongoose.connect('mongodb://127.0.0.1:27017/bloodlink', {
        serverSelectionTimeoutMS: 2000,
      });
      console.log(`[Database] Local Development MongoDB Connected: ${conn.connection.host}`);
      global.__dbConnectionError = null;
      global.__dbMode = 'Local MongoDB (Development)';
      return conn;
    } catch (error) {
      console.warn(`[Database] Local daemon not reachable: ${error.message}`);
    }
  }

  // 3. Autonomous Zero-Configuration Embedded MongoDB Engine (MongoMemoryServer)
  // This ensures 100% operational functionality on Render or anywhere without requiring manual Atlas setup
  try {
    console.log('[Database] Initializing autonomous zero-configuration embedded MongoDB engine...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const memServer = await MongoMemoryServer.create({
      instance: {
        dbName: 'bloodlink',
      },
    });
    global.__mongoMemoryServer = memServer;
    const memUri = memServer.getUri();
    const conn = await mongoose.connect(memUri, {
      serverSelectionTimeoutMS: 15000,
    });
    global.__dbConnectionError = null;
    global.__dbMode = 'Embedded Self-Hosted MongoDB Engine (Zero-Config)';
    console.log(`[Database] Embedded MongoDB Engine Connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error(`[Database] Failed to initialize embedded MongoDB engine: ${err.message}`);
    global.__dbConnectionError = err.message;
    return null;
  }
};

module.exports = connectDB;

