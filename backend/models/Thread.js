import mongoose from 'mongoose';

const threadSchema = new mongoose.Schema({
  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorName: {
    type: String,
    required: true
  },
  authorAvatar: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  pinned: {
    type: Boolean,
    default: false
  },
  postCount: {
    type: Number,
    default: 1
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

threadSchema.index({ gameId: 1, pinned: -1, lastActivity: -1 });

export default mongoose.model('Thread', threadSchema);
