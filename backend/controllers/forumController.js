import Thread from '../models/Thread.js';
import Post from '../models/Post.js';
import Game from '../models/Game.js';
import * as memoryStore from '../config/memoryStore.js';

// @route   GET /api/games/:gameId/threads
export const getGameThreads = async (req, res) => {
  try {
    const { gameId } = req.params;
    try {
      const threads = await Thread.find({ gameId }).sort({ pinned: -1, lastActivity: -1 });
      return res.json({ threads });
    } catch (dbErr) {
      const list = memoryStore.threads.filter(t => t.gameId === gameId);
      return res.json({ threads: list });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @route   POST /api/games/:gameId/threads
export const createThread = async (req, res) => {
  try {
    const { gameId } = req.params;
    const { title, content, pinned } = req.body;

    try {
      const game = await Game.findById(gameId);
      if (!game) return res.status(404).json({ error: 'Game not found' });

      const thread = await Thread.create({
        gameId,
        authorId: req.user._id,
        authorName: req.user.name,
        authorAvatar: req.user.avatar,
        title,
        content,
        pinned: req.user.role === 'admin' ? (pinned || false) : false
      });

      await Post.create({
        threadId: thread._id,
        authorId: req.user._id,
        authorName: req.user.name,
        authorAvatar: req.user.avatar,
        content
      });

      return res.status(201).json({ message: 'Thread created successfully', thread });
    } catch (dbErr) {
      // Memory Fallback
      const newThread = {
        _id: 'thread_' + Date.now(),
        gameId,
        authorId: req.user?._id || 'user_gamer_1',
        authorName: req.user?.name || 'MatrixGamer_99',
        authorAvatar: req.user?.avatar || '',
        title,
        content,
        pinned: false,
        postCount: 1,
        lastActivity: new Date(),
        createdAt: new Date()
      };
      memoryStore.threads.push(newThread);

      const newPost = {
        _id: 'post_' + Date.now(),
        threadId: newThread._id,
        authorId: req.user?._id || 'user_gamer_1',
        authorName: req.user?.name || 'MatrixGamer_99',
        authorAvatar: req.user?.avatar || '',
        content,
        createdAt: new Date()
      };
      memoryStore.posts.push(newPost);

      return res.status(201).json({ message: 'Thread created in memory store fallback', thread: newThread });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// @route   GET /api/threads/:threadId
export const getThreadDetails = async (req, res) => {
  try {
    const { threadId } = req.params;
    try {
      const thread = await Thread.findById(threadId);
      if (!thread) return res.status(404).json({ error: 'Thread not found' });
      const posts = await Post.find({ threadId }).sort({ createdAt: 1 });
      return res.json({ thread, posts });
    } catch (dbErr) {
      const thread = memoryStore.threads.find(t => t._id === threadId);
      if (!thread) return res.status(404).json({ error: 'Thread not found' });
      const posts = memoryStore.posts.filter(p => p.threadId === threadId);
      return res.json({ thread, posts });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @route   POST /api/threads/:threadId/posts
export const createPostReply = async (req, res) => {
  try {
    const { threadId } = req.params;
    const { content } = req.body;

    try {
      const thread = await Thread.findById(threadId);
      if (!thread) return res.status(404).json({ error: 'Thread not found' });

      const post = await Post.create({
        threadId,
        authorId: req.user._id,
        authorName: req.user.name,
        authorAvatar: req.user.avatar,
        content
      });

      thread.postCount += 1;
      thread.lastActivity = new Date();
      await thread.save();

      return res.status(201).json({ message: 'Reply posted successfully', post, thread });
    } catch (dbErr) {
      const thread = memoryStore.threads.find(t => t._id === threadId);
      if (!thread) return res.status(404).json({ error: 'Thread not found' });

      const newPost = {
        _id: 'post_' + Date.now(),
        threadId,
        authorId: req.user?._id || 'user_gamer_1',
        authorName: req.user?.name || 'MatrixGamer_99',
        authorAvatar: req.user?.avatar || '',
        content,
        createdAt: new Date()
      };
      memoryStore.posts.push(newPost);
      thread.postCount += 1;
      thread.lastActivity = new Date();

      return res.status(201).json({ message: 'Reply posted to memory store fallback', post: newPost, thread });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
