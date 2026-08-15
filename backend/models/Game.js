import mongoose from 'mongoose';

const storeLinkSchema = new mongoose.Schema({
  store: {
    type: String,
    enum: ['Steam', 'Epic', 'Itch.io', 'GOG', 'Official'],
    required: true
  },
  url: {
    type: String,
    required: true
  },
  affiliateTag: {
    type: String,
    default: 'indiegamerhub'
  }
}, { _id: false });

const gameSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  shortDescription: {
    type: String,
    default: ''
  },
  genre: [{
    type: String,
    required: true,
    trim: true
  }],
  releaseDate: {
    type: String,
    required: true
  },
  developerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  developerName: {
    type: String,
    required: true
  },
  steamAppId: {
    type: String,
    default: ''
  },
  price: {
    type: Number,
    default: 0
  },
  headerImage: {
    type: String,
    required: true
  },
  screenshots: [{
    type: String
  }],
  trailerUrl: {
    type: String,
    default: ''
  },
  storeLinks: [storeLinkSchema],
  isFeatured: {
    type: Boolean,
    default: false
  },
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  affiliateClicks: {
    type: Number,
    default: 0
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'
  }
}, {
  timestamps: true
});

// Index for search & discovery filters
gameSchema.index({ title: 'text', description: 'text', developerName: 'text' });
gameSchema.index({ isFeatured: -1, averageRating: -1 });
gameSchema.index({ reviewCount: -1 });

export default mongoose.model('Game', gameSchema);
