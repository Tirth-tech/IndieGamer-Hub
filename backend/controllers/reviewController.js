import mongoose from 'mongoose';
import Review from '../models/Review.js';
import Game from '../models/Game.js';
import * as memoryStore from '../config/memoryStore.js';

export const updateGameAverageRating = async (gameId) => {
  try {
    const objectId = new mongoose.Types.ObjectId(gameId);
    const stats = await Review.aggregate([
      { $match: { gameId: objectId } },
      {
        $group: {
          _id: '$gameId',
          averageRating: { $avg: '$rating' },
          reviewCount: { $sum: 1 }
        }
      }
    ]);

    if (stats.length > 0) {
      const roundedAvg = Math.round(stats[0].averageRating * 10) / 10;
      await Game.findByIdAndUpdate(gameId, {
        averageRating: roundedAvg,
        reviewCount: stats[0].reviewCount
      });
    } else {
      await Game.findByIdAndUpdate(gameId, {
        averageRating: 0,
        reviewCount: 0
      });
    }
  } catch (err) {
    // Memory fallback logic
    const game = memoryStore.games.find(g => g._id === gameId);
    if (game) {
      const revs = memoryStore.reviews.filter(r => r.gameId === gameId);
      const totalRating = revs.reduce((sum, r) => sum + r.rating, 0);
      game.reviewCount = revs.length;
      game.averageRating = revs.length > 0 ? Math.round((totalRating / revs.length) * 10) / 10 : 0;
    }
  }
};

// @route   POST /api/games/:gameId/reviews
export const createReview = async (req, res) => {
  try {
    const { gameId } = req.params;
    const { rating, title, content } = req.body;

    try {
      const game = await Game.findById(gameId);
      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }

      const existingReview = await Review.findOne({ gameId, userId: req.user._id });
      if (existingReview) {
        return res.status(400).json({ error: 'You have already reviewed this game.' });
      }

      const review = await Review.create({
        gameId,
        userId: req.user._id,
        userName: req.user.name,
        userAvatar: req.user.avatar,
        rating: Number(rating),
        title,
        content
      });

      await updateGameAverageRating(gameId);
      const updatedGame = await Game.findById(gameId);

      return res.status(201).json({
        message: 'Review posted successfully',
        review,
        averageRating: updatedGame.averageRating,
        reviewCount: updatedGame.reviewCount
      });
    } catch (dbErr) {
      // Memory Fallback
      const newReview = {
        _id: 'review_' + Date.now(),
        gameId,
        userId: req.user?._id || 'user_gamer_1',
        userName: req.user?.name || 'MatrixGamer_99',
        userAvatar: req.user?.avatar || '',
        rating: Number(rating),
        title,
        content,
        createdAt: new Date()
      };
      memoryStore.reviews.push(newReview);
      await updateGameAverageRating(gameId);
      
      const game = memoryStore.games.find(g => g._id === gameId);
      return res.status(201).json({
        message: 'Review posted to memory store fallback',
        review: newReview,
        averageRating: game?.averageRating || Number(rating),
        reviewCount: game?.reviewCount || 1
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @route   GET /api/games/:gameId/reviews
export const getGameReviews = async (req, res) => {
  try {
    const { gameId } = req.params;
    try {
      const reviewsList = await Review.find({ gameId }).sort({ createdAt: -1 });
      const ratingBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      reviewsList.forEach(r => {
        if (ratingBreakdown[r.rating] !== undefined) ratingBreakdown[r.rating]++;
      });
      return res.json({ reviews: reviewsList, ratingBreakdown, count: reviewsList.length });
    } catch (dbErr) {
      const reviewsList = memoryStore.reviews.filter(r => r.gameId === gameId);
      const ratingBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
      reviewsList.forEach(r => {
        if (ratingBreakdown[r.rating] !== undefined) ratingBreakdown[r.rating]++;
      });
      return res.json({ reviews: reviewsList, ratingBreakdown, count: reviewsList.length });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @route   DELETE /api/reviews/:id
export const deleteReview = async (req, res) => {
  try {
    try {
      const review = await Review.findById(req.params.id);
      if (!review) return res.status(404).json({ error: 'Review not found' });

      if (review.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Not authorized' });
      }

      const gameId = review.gameId;
      await review.deleteOne();
      await updateGameAverageRating(gameId);
      return res.json({ message: 'Review deleted successfully' });
    } catch (dbErr) {
      const index = memoryStore.reviews.findIndex(r => r._id === req.params.id);
      if (index === -1) return res.status(404).json({ error: 'Review not found' });
      const gameId = memoryStore.reviews[index].gameId;
      memoryStore.reviews.splice(index, 1);
      await updateGameAverageRating(gameId);
      return res.json({ message: 'Review deleted from memory store' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
