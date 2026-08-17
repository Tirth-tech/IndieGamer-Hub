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
      { email: 'tirthkapuriya18@gmail.com' },
      {
        $set: {
          password: hashed,
          name: 'Admin Tirth',
          email: 'tirthkapuriya18@gmail.com',
          role: 'admin',
          bio: 'Platform Administrator',
          country: 'India',
          avatar: 'https://ui-avatars.com/api/?name=Admin+Tirth&background=FF6B00&color=fff&size=150&bold=true&format=png',
          savedGames: []
        }
      },
      { upsert: true, new: true }
    );

    console.log('✅ Admin account ready!');
    console.log('   Email   : tirthkapuriya18@gmail.com');
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
