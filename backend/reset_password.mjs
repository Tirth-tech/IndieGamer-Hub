import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

const userSchema = new mongoose.Schema({
  name: String, email: String, password: String, role: String,
  avatar: String, bio: String, country: String, savedGames: Array
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

async function resetPassword() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas');

    const newPassword = 'asha15';
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);

    const result = await User.findOneAndUpdate(
      { email: 'tirthkapuriya@gmail.com' },
      {
        $set: {
          password: hashed,
          name: 'Tirth Kapuriya',
          email: 'tirthkapuriya@gmail.com',
          role: 'admin',
          bio: 'Platform Administrator',
          country: 'India',
          avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
          savedGames: []
        }
      },
      { upsert: true, new: true }
    );

    console.log('✅ Admin account ready!');
    console.log('   Email   : tirthkapuriya@gmail.com');
    console.log('   Password: asha15');
    console.log('   Role    : admin');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

resetPassword();
