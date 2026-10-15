const mongoose = require('mongoose');

let mongoServer;

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (mongoUri) {
    try {
      const conn = await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`[Database] Cloud MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.error(`[Database] Cloud MongoDB connection error: ${error.message}`);
    }
  }

  // Try local MongoDB (e.g. for local development)
  try {
    const conn = await mongoose.connect('mongodb://127.0.0.1:27017/bloodlink', {
      serverSelectionTimeoutMS: 2000,
    });
    console.log(`[Database] Local MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[Database] Local MongoDB not available: ${error.message}`);
  }

  // In-memory fallback for non-production environments
  if (process.env.NODE_ENV !== 'production') {
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoServer = await MongoMemoryServer.create();
      const memUri = mongoServer.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(`[Database] In-Memory MongoDB Server Connected: ${conn.connection.host}`);
      return conn;
    } catch (memError) {
      console.warn(`[Database] In-Memory Mongo Server skipped: ${memError.message}`);
    }
  } else {
    console.warn(`[Database] Running in production mode without MONGO_URI. API will run, but database operations require MONGO_URI environment variable.`);
  }
};

module.exports = connectDB;
