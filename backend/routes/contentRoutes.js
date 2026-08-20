import express from 'express';
import { getContent, updateContent } from '../controllers/contentController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/:key', getContent);
router.put('/:key', protect, authorize('admin'), updateContent);

export default router;
