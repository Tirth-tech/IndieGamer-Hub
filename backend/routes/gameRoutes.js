import express from 'express';
import {
  getGames,
  getFeaturedGames,
  getTrendingGames,
  getUpcomingGames,
  getGameById,
  createGame,
  updateGame,
  deleteGame,
  toggleFeatured,
  previewSteamGame,
  previewEpicGame,
  getPendingGames,
  approveGame
} from '../controllers/gameController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getGames);
router.get('/featured', getFeaturedGames);
router.get('/trending', getTrendingGames);
router.get('/upcoming', getUpcomingGames);
router.get('/pending', protect, authorize('admin'), getPendingGames);
router.get('/steam-preview/:appId', protect, previewSteamGame);
router.get('/epic-preview/:slug', protect, previewEpicGame);
router.get('/:id', getGameById);

router.post('/', protect, authorize('developer', 'admin'), createGame);
router.put('/:id/approve', protect, authorize('admin'), approveGame);
router.put('/:id/featured', protect, authorize('admin'), toggleFeatured);
router.put('/:id', protect, authorize('developer', 'admin'), updateGame);
router.delete('/:id', protect, authorize('developer', 'admin'), deleteGame);

export default router;
