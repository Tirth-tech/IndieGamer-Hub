import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

export const connectDB = async () => {
  // Disable command buffering so queries fail fast to memoryStore when disconnected
  mongoose.set('bufferCommands', false);

  const mongoUri = process.env.MONGODB_URI;

  if (mongoUri) {
    try {
      console.log(`Connecting to MongoDB at ${mongoUri}...`);
      await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
      console.log('MongoDB Connected via MONGODB_URI!');
      return;
    } catch (err) {
      console.warn('MONGODB_URI connection error:', err.message);
    }
  }

  // Attempt local mongodb first
  try {
    console.log('Connecting to local mongodb://127.0.0.1:27017/indiegamerhub...');
    await mongoose.connect('mongodb://127.0.0.1:27017/indiegamerhub', { serverSelectionTimeoutMS: 1500 });
    console.log('MongoDB Connected locally!');
    return;
  } catch (err) {
    console.log('Local MongoDB not running. Launching MongoMemoryServer in background...');
  }

  // Launch MongoMemoryServer (MongoDB 5.0.22 for Mongoose 8 compatibility)
  MongoMemoryServer.create({
    instance: { dbName: 'indiegamerhub' },
    binary: { version: '5.0.22' }
  }).then(async (ms) => {
    mongoServer = ms;
    const uri = ms.getUri();
    await mongoose.connect(uri);
    console.log(`MongoDB Connected in-memory at: ${uri}`);
    
    // Auto seed initial data
    const Game = (await import('../models/Game.js')).default;
    const count = await Game.countDocuments().catch(() => 0);
    if (count === 0) {
      console.log('Empty database detected. Auto-seeding initial games catalog...');
      const seedModule = await import('../seed.js');
      await seedModule.seedData();
    }
  }).catch(e => console.warn('MongoMemoryServer note:', e.message));
};
