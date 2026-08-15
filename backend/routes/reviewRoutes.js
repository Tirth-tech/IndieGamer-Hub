import express from 'express';
import { createReview, getGameReviews, deleteReview } from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/game/:gameId', getGameReviews);
router.post('/game/:gameId', protect, createReview);
router.delete('/:id', protect, deleteReview);

export default router;
