const mongoose = require('mongoose');

let mongoServer;

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (mongoUri) {
    try {
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
      });
      const hostDesc = mongoUri.includes('127.0.0.1') || mongoUri.includes('localhost') ? 'Local MongoDB' : 'Cloud MongoDB Atlas';
      console.log(`[Database] ${hostDesc} Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.error(`[Database] MongoDB connection error for MONGO_URI: ${error.message}`);
    }
  }

  // Try local MongoDB (e.g. for local development) if MONGO_URI was not already local
  if (!mongoUri || (!mongoUri.includes('127.0.0.1') && !mongoUri.includes('localhost'))) {
    try {
      const conn = await mongoose.connect('mongodb://127.0.0.1:27017/bloodlink', {
        serverSelectionTimeoutMS: 2000,
      });
      console.log(`[Database] Local MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.warn(`[Database] Local MongoDB not available: ${error.message}`);
    }
  }

  // In-memory fallback for zero-setup execution if cloud and local MongoDB are not available
  try {
    const memoryServerPromise = async () => {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoServer = await MongoMemoryServer.create();
      const memUri = mongoServer.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(`[Database] In-Memory MongoDB Server Connected: ${conn.connection.host}`);
      return conn;
    };

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('In-memory MongoDB startup timed out after 8s')), 8000)
    );

    return await Promise.race([memoryServerPromise(), timeoutPromise]);
  } catch (memError) {
    console.warn(`[Database] In-Memory Mongo Server skipped/unavailable: ${memError.message}`);
    console.warn(`[Database] Note: For persistent production data, configure MONGO_URI in your Render environment variables.`);
  }
};

module.exports = connectDB;
