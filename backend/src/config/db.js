const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;

    // Use in-memory MongoDB for local dev if no real URI is configured
    if (!uri || uri.includes('<username>') || uri.includes('<password>')) {
      try {
        console.log('No valid MONGODB_URI found. Starting in-memory MongoDB...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        uri = mongod.getUri();
        console.log(`In-memory MongoDB started at: ${uri}`);
      } catch {
        console.error('MONGODB_URI is not configured and mongodb-memory-server is not installed.');
        console.error('Please set MONGODB_URI in your .env file.');
        process.exit(1);
      }
    }

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
