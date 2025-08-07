const express = require('express');
const Destination = require('../models/Destination');
const { validateSearch, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// @desc    Search destinations
// @route   GET /api/search
// @access  Public
router.get('/', validateSearch, handleValidationErrors, async (req, res) => {
  try {
    const {
      destination,
      category,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
      sortBy = 'rating.average',
      sortOrder = 'desc',
      featured
    } = req.query;

    // Build query object
    let query = { isActive: true };

    // Text search across multiple fields
    if (destination) {
      query.$text = { $search: destination };
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Price filter
    if (minPrice || maxPrice) {
      query['averageCost.midRange'] = {};
      if (minPrice) query['averageCost.midRange'].$gte = parseInt(minPrice);
      if (maxPrice) query['averageCost.midRange'].$lte = parseInt(maxPrice);
    }

    // Featured filter
    if (featured === 'true') {
      query.featured = true;
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build sort object
    let sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const destinations = await Destination.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    // Get total count for pagination
    const total = await Destination.countDocuments(query);

    // Calculate pagination info
    const totalPages = Math.ceil(total / parseInt(limit));
    const hasNextPage = parseInt(page) < totalPages;
    const hasPrevPage = parseInt(page) > 1;

    res.status(200).json({
      success: true,
      count: destinations.length,
      pagination: {
        current: parseInt(page),
        total: totalPages,
        hasNext: hasNextPage,
        hasPrev: hasPrevPage,
        limit: parseInt(limit),
        totalResults: total
      },
      data: { destinations }
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during search'
    });
  }
});

// @desc    Get destination by ID
// @route   GET /api/search/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);

    if (!destination) {
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
    
    // Handle invalid ObjectId
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

// @desc    Get featured destinations
// @route   GET /api/search/featured/destinations
// @access  Public
router.get('/featured/destinations', async (req, res) => {
  try {
    const { limit = 6 } = req.query;

    const destinations = await Destination.find({
      featured: true,
      isActive: true
    })
      .sort({ 'rating.average': -1 })
      .limit(parseInt(limit))
      .select('-__v');

    res.status(200).json({
      success: true,
      count: destinations.length,
      data: { destinations }
    });
  } catch (error) {
    console.error('Get featured destinations error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get destinations by category
// @route   GET /api/search/category/:category
// @access  Public
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 12 } = req.query;

    const validCategories = ['beach', 'mountain', 'city', 'desert', 'forest', 'island', 'historical', 'cultural'];
    
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category'
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const destinations = await Destination.find({
      category,
      isActive: true
    })
      .sort({ 'rating.average': -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    const total = await Destination.countDocuments({ category, isActive: true });
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
    console.error('Get destinations by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;