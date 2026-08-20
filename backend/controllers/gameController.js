import Game from '../models/Game.js';
import User from '../models/User.js';
import { fetchSteamGameData } from '../services/steamApi.js';
import { fetchEpicGameData } from '../services/epicApi.js';
import * as memoryStore from '../config/memoryStore.js';
import { sendGameApprovalResultEmail } from '../services/emailService.js';

// Helper to check if Mongoose is connected
const isMongoConnected = () => {
  return typeof mongoose !== 'undefined' && mongoose.connection.readyState === 1;
};

// @route   GET /api/games/steam-preview/:appId
export const previewSteamGame = async (req, res) => {
  try {
    const { appId } = req.params;
    const gameData = await fetchSteamGameData(appId);
    res.json({ success: true, game: gameData });
  } catch (error) {
    res.json({
      success: true,
      game: {
        title: `PC Game (App ${req.params.appId || 'Steam'})`,
        description: 'Auto-filled game metadata.',
        price: 0,
        genre: ['Free to Play', 'Action', 'Open World'],
        developerName: req.user?.name || 'Game Developer Studio',
        headerImage: `https://cdn.cloudflare.steamstatic.com/steam/apps/${req.params.appId || '367520'}/header.jpg`
      }
    });
  }
};

// @route   GET /api/games/epic-preview/:slug
export const previewEpicGame = async (req, res) => {
  try {
    const { slug } = req.params;
    const gameData = await fetchEpicGameData(slug);
    res.json({ success: true, game: gameData });
  } catch (error) {
    res.json({
      success: true,
      game: {
        title: req.params.slug ? req.params.slug.toUpperCase() : 'Epic Indie Game',
        description: 'Auto-filled Epic Games Store metadata.',
        price: 19.99,
        genre: ['Action', 'Adventure'],
        developerName: req.user?.username || 'Indie Developer',
        headerImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80'
      }
    });
  }
};

export const stripHtml = (text = '') => {
  if (!text) return '';
  return String(text)
    .replace(/<[^>]*>/g, ' ')
    .replace(/\[\/?(?:img|b|i|u|url|code|list|quote)[^\]]*\]/gi, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/(?:src|class|href)="[^"]*"/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
};

// @route   POST /api/games
export const createGame = async (req, res) => {
  try {
    const {
      title,
      description,
      shortDescription,
      genre,
      releaseDate,
      steamAppId,
      price,
      headerImage,
      screenshots,
      trailerUrl,
      storeLinks,
      developerName,
      hoursPlayed
    } = req.body;

    // Admin submissions are auto-approved; Developer submissions require Admin approval
    const approvalStatus = req.user?.role === 'admin' ? 'approved' : 'pending';

    const cleanDesc = stripHtml(description);
    const cleanShortDesc = stripHtml(shortDescription || description);

    const gameData = {
      title,
      description: cleanDesc,
      shortDescription: cleanShortDesc,
      genre: Array.isArray(genre) ? genre : [genre],
      releaseDate: releaseDate || 'Available Now',
      steamAppId: steamAppId || '',
      price: price !== undefined ? Number(price) : 0,
      headerImage: headerImage || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&auto=format&fit=crop&q=80',
      screenshots: Array.isArray(screenshots) ? screenshots : [],
      trailerUrl: trailerUrl || '',
      storeLinks: Array.isArray(storeLinks) ? storeLinks : [],
      developerId: req.user?._id || 'user_dev_1',
      developerName: developerName || req.user?.name || 'Indie Studio',
      approvalStatus,
      hoursPlayed: hoursPlayed !== undefined ? Number(hoursPlayed) : 0
    };

    try {
      const newGame = await Game.create(gameData);
      return res.status(201).json({
        message: approvalStatus === 'pending'
          ? 'Game submitted successfully! It is pending Admin approval before appearing on the public catalog.'
          : 'Game published successfully!',
        pending: approvalStatus === 'pending',
        game: newGame
      });
    } catch (dbErr) {
      // Memory Fallback
      const newMemGame = {
        _id: 'game_' + Date.now(),
        ...gameData,
        averageRating: 5.0,
        reviewCount: 0,
        affiliateClicks: 0
      };
      memoryStore.games.push(newMemGame);
      return res.status(201).json({
        message: approvalStatus === 'pending'
          ? 'Game submitted! Awaiting Admin approval (memory store fallback).'
          : 'Game published (memory store fallback)',
        pending: approvalStatus === 'pending',
        game: newMemGame
      });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @route   GET /api/games/pending (Admin only)
export const getPendingGames = async (req, res) => {
  try {
    try {
      const pending = await Game.find({ approvalStatus: 'pending' }).sort({ createdAt: -1 });
      return res.json({ games: pending });
    } catch (dbErr) {
      const pending = memoryStore.games.filter(g => g.approvalStatus === 'pending');
      return res.json({ games: pending });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @route   PUT /api/games/:id/approve?action=approve|reject (Admin only)
export const approveGame = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.query; // 'approve' or 'reject'

    try {
      const game = await Game.findById(id);
      game.approvalStatus = action === 'approve' ? 'approved' : 'rejected';
      await game.save();

      // Notify developer via email
      try {
        const developer = await User.findById(game.developerId);
        if (developer && developer.email) {
          await sendGameApprovalResultEmail({
            developerEmail: developer.email,
            developerName: developer.name,
            gameTitle: game.title,
            approved: action === 'approve',
            gameId: String(game._id)
          });
        }
      } catch (emailErr) {
        console.warn('Developer notification email error:', emailErr.message);
      }

      return res.json({
        message: `Game '${game.title}' ${action === 'approve' ? 'Approved & Published' : 'Declined/Rejected'}`,
        action: game.approvalStatus,
        game
      });
    } catch (dbErr) {
      const game = memoryStore.games.find(g => g._id === id);
      if (!game) return res.status(404).json({ error: 'Game not found' });
      game.approvalStatus = action === 'approve' ? 'approved' : 'rejected';
      return res.json({
        message: `Game '${game.title}' ${action === 'approve' ? 'Approved & Published' : 'Declined/Rejected'}`,
        action: game.approvalStatus,
        game
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @route   GET /api/games
export const getGames = async (req, res) => {
  try {
    const { search, genre, price, sort, featured, limit = 20, page = 1 } = req.query;
    
    try {
      const filter = {
        approvalStatus: { $nin: ['pending', 'rejected'] }
      };

      if (search) {
        filter.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { developerName: { $regex: search, $options: 'i' } }
        ];
      }

      if (genre) {
        const genresArray = genre.split(',').map(g => g.trim());
        filter.genre = { $in: genresArray };
      }

      if (price) {
        if (price === 'free') {
          filter.price = 0;
        } else if (price === 'under10') {
          filter.price = { $gt: 0, $lte: 10 };
        } else if (price === 'under20') {
          filter.price = { $gt: 0, $lte: 20 };
        }
      }

      if (featured === 'true') {
        filter.isFeatured = true;
      }

      let sortOptions = { createdAt: -1 };
      if (sort === 'rating') {
        sortOptions = { averageRating: -1, reviewCount: -1 };
      } else if (sort === 'trending') {
        sortOptions = { reviewCount: -1, averageRating: -1 };
      } else if (sort === 'newest') {
        sortOptions = { createdAt: -1 };
      } else if (sort === 'price_asc') {
        sortOptions = { price: 1 };
      } else if (sort === 'price_desc') {
        sortOptions = { price: -1 };
      }

      const skip = (Number(page) - 1) * Number(limit);
      const total = await Game.countDocuments(filter);
      const dbGames = await Game.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit));

      return res.json({
        games: dbGames,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
        total
      });
    } catch (dbErr) {
      // Memory Store Fallback
      let list = [...memoryStore.games];

      if (search) {
        const query = search.toLowerCase();
        list = list.filter(g => 
          g.title.toLowerCase().includes(query) || 
          g.description.toLowerCase().includes(query) ||
          g.developerName.toLowerCase().includes(query)
        );
      }

      if (genre) {
        const genresArray = genre.split(',').map(g => g.trim().toLowerCase());
        list = list.filter(g => g.genre.some(cat => genresArray.includes(cat.toLowerCase())));
      }

      if (price) {
        if (price === 'free') list = list.filter(g => g.price === 0);
        else if (price === 'under10') list = list.filter(g => g.price > 0 && g.price <= 10);
        else if (price === 'under20') list = list.filter(g => g.price > 0 && g.price <= 20);
      }

      if (featured === 'true') {
        list = list.filter(g => g.isFeatured);
      }

      if (sort === 'rating') {
        list.sort((a, b) => b.averageRating - a.averageRating);
      } else if (sort === 'trending') {
        list.sort((a, b) => b.reviewCount - a.reviewCount);
      } else if (sort === 'price_asc') {
        list.sort((a, b) => a.price - b.price);
      } else if (sort === 'price_desc') {
        list.sort((a, b) => b.price - a.price);
      }

      const startIdx = (Number(page) - 1) * Number(limit);
      const paginated = list.slice(startIdx, startIdx + Number(limit));

      return res.json({
        games: paginated,
        page: Number(page),
        pages: Math.ceil(list.length / Number(limit)),
        total: list.length
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @route   GET /api/games/featured
export const getFeaturedGames = async (req, res) => {
  try {
    try {
      const featured = await Game.find({ isFeatured: true }).sort({ updatedAt: -1 }).limit(6);
      if (featured.length < 3) {
        const topRated = await Game.find({ _id: { $nin: featured.map(g => g._id) } })
          .sort({ averageRating: -1, reviewCount: -1 })
          .limit(6 - featured.length);
        return res.json({ games: [...featured, ...topRated] });
      }
      return res.json({ games: featured });
    } catch (dbErr) {
      // Memory Fallback
      const featured = memoryStore.games.filter(g => g.isFeatured);
      return res.json({ games: featured.slice(0, 6) });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @route   GET /api/games/trending
export const getTrendingGames = async (req, res) => {
  try {
    try {
      const trending = await Game.find()
        .sort({ reviewCount: -1, averageRating: -1, updatedAt: -1 })
        .limit(8);
      return res.json({ games: trending });
    } catch (dbErr) {
      const trending = [...memoryStore.games].sort((a, b) => b.reviewCount - a.reviewCount);
      return res.json({ games: trending.slice(0, 8) });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @route   GET /api/games/upcoming
export const getUpcomingGames = async (req, res) => {
  try {
    try {
      const upcoming = await Game.find({
        $or: [
          { releaseDate: { $regex: '2026|2027|Soon|TBA', $options: 'i' } },
          { createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }
        ]
      })
      .sort({ createdAt: -1 })
      .limit(8);
      return res.json({ games: upcoming });
    } catch (dbErr) {
      // Memory Fallback
      return res.json({ games: memoryStore.games.slice(0, 8) });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @route   GET /api/games/:id
export const getGameById = async (req, res) => {
  try {
    try {
      const game = await Game.findById(req.params.id);
      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }
      return res.json({ game });
    } catch (dbErr) {
      const game = memoryStore.games.find(g => g._id === req.params.id);
      if (!game) {
        return res.status(404).json({ error: 'Game not found (memory fallback)' });
      }
      return res.json({ game });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @route   PUT /api/games/:id/featured (Admin)
export const toggleFeatured = async (req, res) => {
  try {
    try {
      const game = await Game.findById(req.params.id);
      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }

      game.isFeatured = req.body.isFeatured !== undefined ? req.body.isFeatured : !game.isFeatured;
      await game.save();

      return res.json({
        message: `Game '${game.title}' is now ${game.isFeatured ? 'Featured' : 'Unfeatured'}`,
        game
      });
    } catch (dbErr) {
      const game = memoryStore.games.find(g => g._id === req.params.id);
      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }
      game.isFeatured = req.body.isFeatured !== undefined ? req.body.isFeatured : !game.isFeatured;
      return res.json({
        message: `Game '${game.title}' featured toggle in memory fallback`,
        game
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @route   PUT /api/games/:id (Dev/Admin)
export const updateGame = async (req, res) => {
  try {
    try {
      const game = await Game.findById(req.params.id);
      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }

      if (req.user.role === 'developer' && game.developerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Not authorized to edit this game' });
      }

      if (req.body.description) req.body.description = stripHtml(req.body.description);
      if (req.body.shortDescription) req.body.shortDescription = stripHtml(req.body.shortDescription);

      Object.assign(game, req.body);
      await game.save();

      return res.json({ message: 'Game updated successfully', game });
    } catch (dbErr) {
      const game = memoryStore.games.find(g => g._id === req.params.id);
      if (!game) return res.status(404).json({ error: 'Game not found' });
      Object.assign(game, req.body);
      return res.json({ message: 'Game updated in memory store', game });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @route   DELETE /api/games/:id (Dev/Admin)
export const deleteGame = async (req, res) => {
  try {
    try {
      const game = await Game.findById(req.params.id);
      if (!game) {
        return res.status(404).json({ error: 'Game not found' });
      }

      if (req.user.role === 'developer' && game.developerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: 'Not authorized to delete this game' });
      }

      await game.deleteOne();
      return res.json({ message: 'Game deleted successfully' });
    } catch (dbErr) {
      const index = memoryStore.games.findIndex(g => g._id === req.params.id);
      if (index === -1) return res.status(404).json({ error: 'Game not found' });
      memoryStore.games.splice(index, 1);
      return res.json({ message: 'Game deleted from memory store' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
