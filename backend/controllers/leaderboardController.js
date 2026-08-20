import User from '../models/User.js';
import * as memoryStore from '../config/memoryStore.js';

// @route   GET /api/leaderboard
// @desc    Get counts and user lists grouped by role
// @access  Public
export const getLeaderboard = async (req, res) => {
  try {
    try {
      // Group and count users by role (excluding rejected requests)
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

      // Get users for leaderboard (excluding rejected requests)
      const users = await User.find({ status: { $ne: 'rejected' } })
        .select('name role avatar country createdAt bio')
        .sort({ createdAt: 1 }) // oldest joined (first registered) first
        .limit(100);

      return res.json({
        counts: roleCounts,
        users
      });
    } catch (dbErr) {
      // Memory Store Fallback (include any user that is not explicitly rejected)
      const approvedUsers = memoryStore.users.filter(u => !u.status || u.status === 'approved');

      const roleCounts = {
        admin: approvedUsers.filter(u => u.role === 'admin').length,
        developer: approvedUsers.filter(u => u.role === 'developer').length,
        gamer: approvedUsers.filter(u => u.role === 'gamer').length
      };

      const users = approvedUsers.map(u => ({
        _id: u._id || u.id,
        name: u.name,
        role: u.role,
        avatar: u.avatar,
        country: u.country,
        createdAt: u.createdAt || new Date(),
        bio: u.bio
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
