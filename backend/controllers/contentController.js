import SiteContent from '../models/SiteContent.js';

// In-memory fallback if Mongoose DB connection is not available
const memoryContent = {};

// @route   GET /api/content/:key
// @desc    Get dynamic site content by key
// @access  Public
export const getContent = async (req, res) => {
  try {
    const { key } = req.params;
    try {
      const content = await SiteContent.findOne({ key });
      if (!content) {
        // Fallback to memory content if available, else 404
        if (memoryContent[key]) {
          return res.json({ data: memoryContent[key] });
        }
        return res.status(404).json({ error: 'Content not found' });
      }
      return res.json({ data: content.data });
    } catch (dbErr) {
      if (memoryContent[key]) {
        return res.json({ data: memoryContent[key] });
      }
      return res.status(404).json({ error: 'Content not found (memory fallback)' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// @route   PUT /api/content/:key
// @desc    Update dynamic site content by key (Admin only)
// @access  Private/Admin
export const updateContent = async (req, res) => {
  try {
    const { key } = req.params;
    const { data } = req.body;

    if (!data) {
      return res.status(400).json({ error: 'Please provide content data' });
    }

    try {
      let content = await SiteContent.findOne({ key });
      if (content) {
        content.data = data;
        content.updatedBy = req.user?._id;
        await content.save();
      } else {
        content = await SiteContent.create({
          key,
          data,
          updatedBy: req.user?._id
        });
      }
      memoryContent[key] = data; // Keep sync
      return res.json({ message: 'Content updated successfully', data: content.data });
    } catch (dbErr) {
      // Memory fallback update
      memoryContent[key] = data;
      return res.json({ message: 'Content updated successfully (memory store fallback)', data });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
