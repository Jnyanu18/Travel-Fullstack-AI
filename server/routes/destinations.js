const express = require('express');
const Destination = require('../models/Destination');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// @desc    Get all destinations
// @route   GET /api/destinations
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 12, category, featured } = req.query;

    let query = { isActive: true };
    
    if (category) query.category = category;
    if (featured === 'true') query.featured = true;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const destinations = await Destination.find(query)
      .sort({ 'rating.average': -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Destination.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.status(200).json({
      success: true,
      count: destinations.length,
      pagination: {
        current: parseInt(page),
        total: totalPages,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1,
        limit: parseInt(limit),
        totalResults: total
      },
      data: { destinations }
    });
  } catch (error) {
    console.error('Get destinations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single destination
// @route   GET /api/destinations/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination || !destination.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { destination }
    });
  } catch (error) {
    console.error('Get destination error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create new destination (Admin only)
// @route   POST /api/destinations
// @access  Private/Admin
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const destination = await Destination.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Destination created successfully',
      data: { destination }
    });
  } catch (error) {
    console.error('Create destination error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during destination creation'
    });
  }
});

// @desc    Update destination (Admin only)
// @route   PUT /api/destinations/:id
// @access  Private/Admin
router.put('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const destination = await Destination.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Destination updated successfully',
      data: { destination }
    });
  } catch (error) {
    console.error('Update destination error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: messages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete destination (Admin only)
// @route   DELETE /api/destinations/:id
// @access  Private/Admin
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    // Soft delete by setting isActive to false
    destination.isActive = false;
    await destination.save();

    res.status(200).json({
      success: true,
      message: 'Destination deleted successfully'
    });
  } catch (error) {
    console.error('Delete destination error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Toggle featured status (Admin only)
// @route   PUT /api/destinations/:id/featured
// @access  Private/Admin
router.put('/:id/featured', protect, authorize('admin'), async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    destination.featured = !destination.featured;
    await destination.save();

    res.status(200).json({
      success: true,
      message: `Destination ${destination.featured ? 'featured' : 'unfeatured'} successfully`,
      data: { destination }
    });
  } catch (error) {
    console.error('Toggle featured error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;