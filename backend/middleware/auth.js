import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import * as memoryStore from '../config/memoryStore.js';

const JWT_SECRET = process.env.JWT_SECRET || 'indiegamerhub_super_secret_jwt_key_2026';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ error: 'Not authorized, token missing' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    try {
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        // Fallback to memory store lookup
        const memUser = memoryStore.users.find(u => u._id === decoded.id);
        if (memUser) {
          req.user = memUser;
        } else {
          return res.status(401).json({ error: 'User not found' });
        }
      }
    } catch (dbErr) {
      // Memory Store lookup fallback
      const memUser = memoryStore.users.find(u => u._id === decoded.id);
      if (memUser) {
        req.user = memUser;
      } else {
        return res.status(401).json({ error: 'User not found in memory store fallback' });
      }
    }

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Not authorized, token invalid or expired' });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: `User role '${req.user?.role}' is not authorized to perform this action` 
      });
    }
    next();
  };
};

export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

export const optionalAuth = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      try {
        req.user = await User.findById(decoded.id).select('-password');
      } catch (dbErr) {
        const memUser = memoryStore.users.find(u => u._id === decoded.id);
        if (memUser) req.user = memUser;
      }
    } catch (err) {
      // ignore invalid token
    }
  }
  next();
};

export const generateToken = (userId) => {
  return jwt.sign({ id: String(userId) }, JWT_SECRET, { expiresIn: '30d' });
};
export { JWT_SECRET };
