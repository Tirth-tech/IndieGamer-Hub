import User from '../models/User.js';
import * as memoryStore from '../config/memoryStore.js';

const DEFAULT_COMMUNITY_USERS = [
  {
    name: 'Admin Tirth',
    email: 'tirthkapuriya18@gmail.com',
    password: 'asha15_default_hash',
    role: 'admin',
    status: 'approved',
    bio: 'Platform Lead Administrator & IndieGamer Hub Creator.',
    country: 'India'
  },
  {
    name: 'CAPCOM & FromSoftware',
    email: 'dev@capcom.com',
    password: 'dev_default_hash',
    role: 'developer',
    status: 'approved',
    bio: 'Creators of Sekiro: Shadows Die Twice, Resident Evil, and Monster Hunter.',
    country: 'Japan'
  },
  {
    name: 'Team Cherry',
    email: 'dev@teamcherry.com',
    password: 'dev_default_hash',
    role: 'developer',
    status: 'approved',
    bio: 'Indie game studio based in Adelaide, Australia. Creators of Hollow Knight.',
    country: 'Australia'
  },
  {
    name: 'MatrixGamer_99',
    email: 'alex@gamer.com',
    password: 'gamer_default_hash',
    role: 'gamer',
    status: 'approved',
    bio: 'Passionate action speedrunner & AAA game reviewer.',
    country: 'United States'
  },
  {
    name: 'CyberNinja_2077',
    email: 'ninja@gamer.com',
    password: 'gamer_default_hash',
    role: 'gamer',
    status: 'approved',
    bio: 'FPS enthusiast & RTX graphics benchmarking gamer.',
    country: 'United Kingdom'
  }
];

// @route   GET /api/leaderboard
// @desc    Get counts and user lists grouped by role
// @access  Public
export const getLeaderboard = async (req, res) => {
  try {
    try {
      let users = await User.find({ status: { $ne: 'rejected' } })
        .select('name role avatar country createdAt bio')
        .sort({ createdAt: 1 })
        .limit(100);

      // Auto-seed default community members if database collection is empty
      if (!users || users.length === 0) {
        try {
          await User.insertMany(DEFAULT_COMMUNITY_USERS);
          users = await User.find({ status: { $ne: 'rejected' } })
            .select('name role avatar country createdAt bio')
            .sort({ createdAt: 1 })
            .limit(100);
        } catch (seedErr) {
          console.warn('Auto-seed leaderboard users warning:', seedErr.message);
        }
      }

      // Group and count users by role
      const counts = await User.aggregate([
        { $match: { status: { $ne: 'rejected' } } },
        { $group: { _id: '$role', count: { $sum: 1 } } }
      ]);

      const roleCounts = {
        admin: 0,
        developer: 0,
        gamer: 0
      };

      counts.forEach(item => {
        if (roleCounts[item._id] !== undefined) {
          roleCounts[item._id] = item.count;
        }
      });

      // If aggregate counts are still 0 for any role present in users list, derive from fetched list
      if (roleCounts.admin === 0 && roleCounts.developer === 0 && roleCounts.gamer === 0 && users.length > 0) {
        roleCounts.admin = users.filter(u => u.role === 'admin').length;
        roleCounts.developer = users.filter(u => u.role === 'developer').length;
        roleCounts.gamer = users.filter(u => u.role === 'gamer').length;
      }

      return res.json({
        counts: roleCounts,
        users: users || []
      });
    } catch (dbErr) {
      // Memory Store Fallback
      let approvedUsers = memoryStore.users.filter(u => !u.status || u.status === 'approved');

      if (!approvedUsers || approvedUsers.length === 0) {
        approvedUsers = DEFAULT_COMMUNITY_USERS.map((u, i) => ({ ...u, _id: `mem_user_${i}` }));
      }

      const roleCounts = {
        admin: approvedUsers.filter(u => u.role === 'admin').length,
        developer: approvedUsers.filter(u => u.role === 'developer').length,
        gamer: approvedUsers.filter(u => u.role === 'gamer').length
      };

      const users = approvedUsers.map(u => ({
        _id: u._id || u.id,
        name: u.name,
        role: u.role,
        avatar: u.avatar || '',
        country: u.country || 'United States',
        createdAt: u.createdAt || new Date(),
        bio: u.bio || 'Community member'
      }));

      return res.json({
        counts: roleCounts,
        users
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
