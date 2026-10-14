const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/bloodlink', {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`[Database] Local MongoDB connection failed (${error.message}). Initializing In-Memory Mongo Instance for uninterrupted execution...`);
    try {
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      const conn = await mongoose.connect(mongoUri);
      console.log(`[Database] In-Memory MongoDB Server Connected: ${conn.connection.host}`);
    } catch (memError) {
      console.error(`[Database] In-Memory Mongo Server Error: ${memError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
