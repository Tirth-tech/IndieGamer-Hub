import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('No MONGODB_URI found in environment');
      process.exit(1);
    }

    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected!');

    const email = 'tirthkapuriya18@gmail.com';
    const password = 'asha15';

    let user = await User.findOne({ email });

    if (user) {
      console.log(`Found existing user for ${email}, updating role to admin and resetting password...`);
      user.password = password;
      user.role = 'admin';
      user.status = 'approved';
      user.pendingRole = null;
      await user.save();
      console.log(`✅ Admin user ${email} successfully updated in MongoDB!`);
    } else {
      console.log(`Creating new Admin user ${email}...`);
      user = await User.create({
        name: 'Admin Tirth',
        email,
        password,
        role: 'admin',
        status: 'approved',
        bio: 'Platform Administrator',
        country: 'India'
      });
      console.log(`✅ Admin user ${email} successfully created in MongoDB!`);
    }

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
};

seedAdmin();
