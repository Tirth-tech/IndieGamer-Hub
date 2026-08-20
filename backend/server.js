import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';

import authRoutes from './routes/authRoutes.js';
import gameRoutes from './routes/gameRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import forumRoutes from './routes/forumRoutes.js';
import affiliateRoutes from './routes/affiliateRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import leaderboardRoutes from './routes/leaderboardRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/forums', forumRoutes);
app.use('/api/affiliate', affiliateRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'IndieGamer Hub API',
    timestamp: new Date().toISOString(),
    env: {
      has_email_user: !!process.env.EMAIL_USER,
      email_user: process.env.EMAIL_USER || '',
      has_email_pass: !!process.env.EMAIL_PASS,
      email_pass_len: process.env.EMAIL_PASS ? process.env.EMAIL_PASS.length : 0,
      has_mongodb_uri: !!process.env.MONGODB_URI,
      has_frontend_url: !!process.env.FRONTEND_URL,
      frontend_url: process.env.FRONTEND_URL || 'not set',
      has_base_url: !!process.env.BASE_URL,
      base_url: process.env.BASE_URL || 'not set',
      has_admin_email: !!process.env.ADMIN_EMAIL,
      admin_email: process.env.ADMIN_EMAIL || 'not set',
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: err.message || 'Internal Server Error' });
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve frontend static assets in production
const frontendBuildPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendBuildPath));

// Fallback all non-API requests to index.html for client-side routing
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(frontendBuildPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('IndieGamer Hub API running (frontend not built yet)');
    }
  });
});

// Connect Database & Start Server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 IndieGamer Hub API Server running on http://localhost:${PORT}`);
  });
});

export default app;
