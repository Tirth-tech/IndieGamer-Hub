import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['gamer', 'developer', 'admin'],
    default: 'gamer'
  },
  avatar: {
    type: String,
    default: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80'
  },
  bio: {
    type: String,
    default: 'Passionate indie game enthusiast.'
  },
  country: {
    type: String,
    default: 'United States'
  },
  savedGames: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game'
  }],
  // Developer approval workflow
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'  // gamers are auto-approved; developers start as pending
  },
  pendingRole: {
    type: String,
    default: null  // stores 'developer' while awaiting admin approval
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
