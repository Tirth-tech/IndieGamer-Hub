import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';
import * as memoryStore from '../config/memoryStore.js';
import { sendDeveloperApprovalEmail, sendApprovalResultEmail } from '../services/emailService.js';

// ── Single authorized admin email ────────────────────────────────────────────
const isAuthorizedAdmin = (email) => {
  const e = email.toLowerCase().trim();
  return e === 'tirthkapuriya18@gmail.com' ||
         e === 'tirthkapuriya18@gamil.com' ||
         (process.env.ADMIN_EMAIL && e === process.env.ADMIN_EMAIL.toLowerCase());
};

// @route   POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { name, email, password, role, bio, avatar, country } = req.body;

    const isAdmin = isAuthorizedAdmin(email);

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'User with this email already exists' });
      }

      // Admin is auto-assigned ONLY if email matches designated admin email
      let userRole = 'gamer';
      let status   = 'approved';
      let pendingRole = null;

      if (isAdmin) {
        userRole = 'admin';
      } else if (role === 'developer') {
        // Developers start as gamer with pending status until admin approves
        userRole    = 'gamer';
        status      = 'pending';
        pendingRole = 'developer';
      }

      const user = await User.create({
        name, email, password,
        role: userRole,
        status,
        pendingRole,
        bio:     bio     || 'Passionate game enthusiast.',
        avatar:  avatar  || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
        country: country || 'United States'
      });

      // Send approval email to admin for developer requests (fire-and-forget, don't block registration)
      if (status === 'pending') {
        // Send email in background — do NOT await
        sendDeveloperApprovalEmail({
          developerId:    String(user._id),
          developerName:  user.name,
          developerEmail: user.email,
        }).catch(emailErr => {
          console.warn('Email notification failed (check EMAIL_PASS in .env):', emailErr.message);
        });

        return res.status(201).json({
          message: 'Registration successful! Your developer request is pending admin approval. You will receive an email once approved.',
          pending: true,
          user: {
            _id: String(user._id), id: String(user._id),
            name: user.name, email: user.email,
            role: user.role, status: user.status,
            avatar: user.avatar, bio: user.bio,
            country: user.country, savedGames: user.savedGames
          }
        });
      }

      const token = generateToken(user._id);
      return res.status(201).json({
        message: 'Registration successful',
        token,
        user: {
          _id: String(user._id), id: String(user._id),
          name: user.name, email: user.email,
          role: user.role, status: user.status,
          avatar: user.avatar, bio: user.bio,
          country: user.country, savedGames: user.savedGames
        }
      });

    } catch (dbErr) {
      // Memory Fallback
      const existing = memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (existing) return res.status(400).json({ error: 'User with this email already exists' });

      let userRole = 'gamer';
      let status   = 'approved';
      let pendingRole = null;

      if (isAdmin) {
        userRole = 'admin';
      } else if (role === 'developer') {
        userRole    = 'gamer';
        status      = 'pending';
        pendingRole = 'developer';
      }

      const newMemUser = {
        _id: 'user_' + Date.now(), id: 'user_' + Date.now(),
        name, email, password,
        role: userRole,
        status,
        pendingRole,
        bio:     bio     || 'User bio.',
        avatar:  avatar  || 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
        country: country || 'United States',
        savedGames: []
      };
      memoryStore.users.push(newMemUser);

      if (status === 'pending') {
        return res.status(201).json({
          message: 'Registration successful! Your developer request is pending admin approval. You will receive an email once approved.',
          pending: true,
          user: newMemUser
        });
      }

      const token = generateToken(newMemUser._id);
      return res.status(201).json({ message: 'Registration successful (memory store)', token, user: newMemUser });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @route   GET /api/auth/approve/:userId?action=approve|reject  (admin clicks link in email or dashboard)
export const approveDeveloper = async (req, res) => {
  try {
    const { userId } = req.params;
    const { action }  = req.query; // 'approve' or 'reject'
    const isJson = req.headers['accept']?.includes('application/json');

    let user;
    try {
      user = await User.findById(userId);
    } catch (dbErr) {
      user = memoryStore.users.find(u => u._id === userId || u.id === userId);
    }

    if (!user) {
      user = memoryStore.users.find(u => u._id === userId || u.id === userId);
    }

    if (!user) {
      if (isJson) return res.status(404).json({ error: 'User not found' });
      return res.status(404).send('<h2>User not found</h2>');
    }

    if (action === 'approve') {
      user.role        = user.pendingRole || 'developer';
      user.status      = 'approved';
      user.pendingRole = null;
      if (user.save) await user.save();

      // Send notification email to developer
      try {
        await sendApprovalResultEmail({ developerEmail: user.email, developerName: user.name, approved: true });
        console.log(`✅ Approval email sent to ${user.email}`);
      } catch (e) {
        console.error('❌ Developer approval email failed:', e.message, e.response?.body);
      }

      if (isJson) return res.json({ success: true, action: 'approved', user: { name: user.name, email: user.email } });
      const frontendAdminUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin`;
      return res.send(`
        <html><body style="font-family:Arial;background:#0D0D0D;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;margin:0">
          <div style="text-align:center;background:#17130F;padding:40px;border-radius:12px;border:1px solid #FF6B00;max-width:480px;">
            <h1 style="color:#FF6B00">✅ Developer Approved!</h1>
            <p><strong>${user.name}</strong> (${user.email}) is now a verified Developer.</p>
            <p style="color:#9B9B9B">They have been notified by email.</p>
            <a href="${frontendAdminUrl}" style="display:inline-block;margin-top:20px;padding:12px 24px;background:linear-gradient(135deg,#FF6B00,#FFB000);color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;">Return to Admin Dashboard</a>
          </div>
        </body></html>
      `);
    } else {
      user.status      = 'rejected';
      user.pendingRole = null;
      if (user.save) await user.save();

      try {
        await sendApprovalResultEmail({ developerEmail: user.email, developerName: user.name, approved: false });
        console.log(`📧 Rejection email sent to ${user.email}`);
      } catch (e) {
        console.error('❌ Developer rejection email failed:', e.message, e.response?.body);
      }

      if (isJson) return res.json({ success: true, action: 'rejected', user: { name: user.name, email: user.email } });
      const frontendAdminUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/admin`;
      return res.send(`
        <html><body style="font-family:Arial;background:#0D0D0D;color:#fff;display:flex;align-items:center;justify-content:center;height:100vh;margin:0">
          <div style="text-align:center;background:#17130F;padding:40px;border-radius:12px;border:1px solid #FF4444;max-width:480px;">
            <h1 style="color:#FF6B6B">❌ Request Rejected</h1>
            <p><strong>${user.name}</strong>'s developer request has been rejected.</p>
            <p style="color:#9B9B9B">They have been notified by email.</p>
            <a href="${frontendAdminUrl}" style="display:inline-block;margin-top:20px;padding:12px 24px;background:rgba(255,255,255,0.1);color:#fff;text-decoration:none;border-radius:8px;font-weight:bold;">Return to Admin Dashboard</a>
          </div>
        </body></html>
      `);
    }
  } catch (error) {
    res.status(500).send('<h2>Server Error: ' + error.message + '</h2>');
  }
};

// @route   GET /api/auth/pending-developers  (admin dashboard)
export const getPendingDevelopers = async (req, res) => {
  try {
    let pending = [];
    try {
      pending = await User.find({ status: 'pending', pendingRole: 'developer' })
        .select('-password').sort({ createdAt: -1 });
    } catch (dbErr) {
      pending = memoryStore.users.filter(u => u.status === 'pending' && u.pendingRole === 'developer');
    }
    if (!pending || pending.length === 0) {
      pending = memoryStore.users.filter(u => u.status === 'pending' && u.pendingRole === 'developer');
    }
    res.json({ developers: pending });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// @route   GET /api/auth/status/:userId
export const checkApprovalStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    let user;
    try {
      user = await User.findById(userId);
    } catch (dbErr) {
      user = memoryStore.users.find(u => u._id === userId || u.id === userId);
    }

    if (!user) {
      user = memoryStore.users.find(u => u._id === userId || u.id === userId);
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.status === 'pending') {
      return res.json({ status: 'pending' });
    }

    if (user.status === 'approved') {
      const userIdStr = String(user._id || user.id);
      const token = generateToken(userIdStr);
      const uObj = user.toObject ? user.toObject() : { ...user };
      uObj._id = userIdStr;
      uObj.id = userIdStr;
      delete uObj.password;

      return res.json({
        status: 'approved',
        token,
        user: uObj
      });
    }

    if (user.status === 'rejected') {
      return res.json({
        status: 'rejected',
        message: 'Developer request was rejected by admin.'
      });
    }

    return res.json({ status: user.status || 'approved' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      // ── ENFORCE single-admin: strip admin from unauthorized emails ──
      if (user.role === 'admin' && !isAuthorizedAdmin(user.email)) {
        user.role = 'gamer';
        await user.save();
        console.log(`⚠️ Stripped admin role from unauthorized email: ${user.email}`);
      }

      if (user.status === 'pending') {
        return res.status(403).json({
          error: 'Your developer account registration is pending admin approval. You will receive an email once approved.',
          pending: true,
          userId: String(user._id)
        });
      }

      if (user.status === 'rejected') {
        return res.status(403).json({
          error: 'Your developer account registration was rejected by the admin.'
        });
      }

      const token = generateToken(user._id);

      return res.json({
        message: 'Login successful',
        token,
        user: {
          _id: String(user._id),
          id: String(user._id),
          name: user.name,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
          bio: user.bio,
          country: user.country,
          savedGames: user.savedGames
        }
      });
    } catch (dbErr) {
      // Memory Fallback check
      const memUser = memoryStore.users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!memUser) return res.status(401).json({ error: 'Invalid credentials (memory fallback)' });
      
      if (memUser.password && memUser.password !== password) {
        return res.status(401).json({ error: 'Invalid email or password' });
      }

      if (memUser.status === 'pending') {
        return res.status(403).json({
          error: 'Your developer account registration is pending admin approval. You will receive an email once approved.',
          pending: true,
          userId: String(memUser._id)
        });
      }

      if (memUser.status === 'rejected') {
        return res.status(403).json({
          error: 'Your developer account registration was rejected by the admin.'
        });
      }

      const token = generateToken(memUser._id);
      return res.json({
        message: 'Login successful (memory store)',
        token,
        user: {
          ...memUser,
          id: memUser._id
        }
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @route   GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    try {
      const user = await User.findById(req.user._id || req.user.id).select('-password').populate('savedGames', 'title headerImage genre price averageRating');
      if (user) {
        const uObj = user.toObject();
        uObj.id = String(uObj._id);
        return res.json({ user: uObj });
      }
    } catch (dbErr) {
      const memUser = memoryStore.users.find(u => u._id === (req.user._id || req.user.id));
      if (memUser) {
        return res.json({ user: { ...memUser, id: memUser._id } });
      }
    }

    if (req.user) {
      return res.json({ user: { ...req.user, id: req.user._id || req.user.id } });
    }
    return res.status(404).json({ error: 'User session not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @route   POST /api/auth/wishlist/:gameId
export const toggleWishlist = async (req, res) => {
  try {
    try {
      const userId = req.user._id || req.user.id;
      const user = await User.findById(userId);
      const gameId = req.params.gameId;

      const index = user.savedGames.indexOf(gameId);
      let isSaved = false;
      if (index > -1) {
        user.savedGames.splice(index, 1);
        isSaved = false;
      } else {
        user.savedGames.push(gameId);
        isSaved = true;
      }

      await user.save();
      return res.json({ isSaved, savedGames: user.savedGames });
    } catch (dbErr) {
      const userId = req.user._id || req.user.id;
      const memUser = memoryStore.users.find(u => u._id === userId);
      if (!memUser) return res.status(404).json({ error: 'User not found' });

      if (!memUser.savedGames) memUser.savedGames = [];
      const gameId = req.params.gameId;
      const index = memUser.savedGames.indexOf(gameId);
      let isSaved = false;
      if (index > -1) {
        memUser.savedGames.splice(index, 1);
        isSaved = false;
      } else {
        memUser.savedGames.push(gameId);
        isSaved = true;
      }
      return res.json({ isSaved, savedGames: memUser.savedGames });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @route   PUT /api/auth/profile
export const updateProfile = async (req, res) => {
  try {
    const { country, name, bio, avatar, email, newPassword } = req.body;
    const userId = req.user._id || req.user.id;
    try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: 'User not found' });

      if (country) user.country = country;
      if (name)    user.name    = name;
      if (bio)     user.bio     = bio;
      if (avatar)  user.avatar  = avatar;

      // Email update — check uniqueness
      if (email && email !== user.email) {
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ error: 'Email already in use by another account' });
        user.email = email.toLowerCase().trim();
      }

      // Password update
      if (newPassword && newPassword.length >= 6) {
        user.password = newPassword; // pre-save hook hashes it
      }

      await user.save();
      const uObj = user.toObject();
      uObj.id = String(uObj._id);
      delete uObj.password;
      return res.json({ message: 'Profile updated', user: uObj });
    } catch (dbErr) {
      const memUser = memoryStore.users.find(u => u._id === userId);
      if (!memUser) return res.status(404).json({ error: 'User not found' });
      if (country) memUser.country = country;
      if (name)    memUser.name    = name;
      if (bio)     memUser.bio     = bio;
      if (avatar)  memUser.avatar  = avatar;
      if (email)   memUser.email   = email;
      return res.json({ message: 'Profile updated (memory store)', user: { ...memUser, id: memUser._id } });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

