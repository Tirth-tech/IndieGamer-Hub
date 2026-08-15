import express from 'express';
import { register, login, getMe, toggleWishlist, updateProfile, approveDeveloper, getPendingDevelopers, checkApprovalStatus } from '../controllers/authController.js';
import { protect, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/wishlist/:gameId', protect, toggleWishlist);

// Developer approval status check & admin email link handling
router.get('/status/:userId', checkApprovalStatus);
router.get('/approve/:userId', approveDeveloper);

// Admin: list pending developers
router.get('/pending-developers', protect, getPendingDevelopers);

export default router;
