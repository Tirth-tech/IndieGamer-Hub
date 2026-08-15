import express from 'express';
import {
  getGameThreads,
  createThread,
  getThreadDetails,
  createPostReply
} from '../controllers/forumController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/game/:gameId', getGameThreads);
router.post('/game/:gameId', protect, createThread);
router.get('/thread/:threadId', getThreadDetails);
router.post('/thread/:threadId/reply', protect, createPostReply);

export default router;
