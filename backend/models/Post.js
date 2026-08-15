import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  threadId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Thread',
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
  content: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

postSchema.index({ threadId: 1, createdAt: 1 });

export default mongoose.model('Post', postSchema);
