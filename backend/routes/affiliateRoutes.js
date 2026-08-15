import express from 'express';
import Game from '../models/Game.js';
import * as memoryStore from '../config/memoryStore.js';

const router = express.Router();

// @route GET /api/affiliate/redirect?gameId=xxx&store=Steam
router.get('/redirect', async (req, res) => {
  try {
    const { gameId, store } = req.query;

    if (!gameId) {
      return res.status(400).json({ error: 'gameId query parameter is required' });
    }

    let targetUrl = '';
    let title = '';
    let clicks = 0;

    try {
      const game = await Game.findById(gameId);
      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }

      game.affiliateClicks = (game.affiliateClicks || 0) + 1;
      await game.save();

      let matchedLink = game.storeLinks.find(l => l.store.toLowerCase() === (store || 'steam').toLowerCase());
      if (!matchedLink && game.storeLinks.length > 0) {
        matchedLink = game.storeLinks[0];
      }

      targetUrl = matchedLink ? matchedLink.url : `https://store.steampowered.com/search/?term=${encodeURIComponent(game.title)}`;
      title = game.title;
      clicks = game.affiliateClicks;
    } catch (dbErr) {
      // Memory Fallback
      const game = memoryStore.games.find(g => g._id === gameId);
      if (!game) return res.status(404).json({ error: 'Game not found' });

      game.affiliateClicks = (game.affiliateClicks || 0) + 1;
      let matchedLink = game.storeLinks?.find(l => l.store.toLowerCase() === (store || 'steam').toLowerCase());
      if (!matchedLink && game.storeLinks?.length > 0) {
        matchedLink = game.storeLinks[0];
      }
      targetUrl = matchedLink ? matchedLink.url : `https://store.steampowered.com/search/?term=${encodeURIComponent(game.title)}`;
      title = game.title;
      clicks = game.affiliateClicks;
    }

    const separator = targetUrl.includes('?') ? '&' : '?';
    const affiliateUrl = `${targetUrl}${separator}utm_source=indiegamerhub&utm_medium=affiliate&aff_id=IGH2026`;

    res.json({
      success: true,
      originalUrl: targetUrl,
      affiliateUrl: affiliateUrl,
      clicksCount: clicks
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

import { protect } from '../middleware/auth.js';

// @route GET /api/affiliate/stats (Admin views all game stats, Developer views own game stats)
router.get('/stats', protect, async (req, res) => {
  try {
    let list = [];
    try {
      if (req.user.role === 'admin') {
        list = await Game.find().select('title affiliateClicks price isFeatured averageRating reviewCount developerId developerName approvalStatus');
      } else if (req.user.role === 'developer') {
        list = await Game.find({
          $or: [
            { developerId: req.user._id },
            { developerName: req.user.name }
          ]
        }).select('title affiliateClicks price isFeatured averageRating reviewCount developerId developerName approvalStatus');
      } else {
        return res.status(403).json({ error: 'Access denied: Only Admin or Developers can view statistics' });
      }
    } catch (dbErr) {
      if (req.user.role === 'admin') {
        list = memoryStore.games;
      } else if (req.user.role === 'developer') {
        list = memoryStore.games.filter(g => String(g.developerId) === String(req.user._id) || g.developerName === req.user.name);
      }
    }

    const totalClicks = list.reduce((acc, g) => acc + (g.affiliateClicks || 0), 0);
    const estimatedCommission = (totalClicks * 0.75).toFixed(2);

    res.json({
      role: req.user.role,
      totalClicks,
      estimatedCommission: `$${estimatedCommission}`,
      games: list.sort((a, b) => (b.affiliateClicks || 0) - (a.affiliateClicks || 0))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
