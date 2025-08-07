const express = require('express');
const Booking = require('../models/Booking');
const Destination = require('../models/Destination');
const { protect, authorize } = require('../middleware/auth');
const { validateBooking, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
router.post('/', protect, validateBooking, handleValidationErrors, async (req, res) => {
  try {
    const {
      destination,
      bookingType,
      details,
      travelers,
      pricing,
      payment,
      specialRequests
    } = req.body;

    // Verify destination exists
    const destinationExists = await Destination.findById(destination);
    if (!destinationExists) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    // Create booking
    const booking = await Booking.create({
      user: req.user.id,
      destination,
      bookingType,
      details,
      travelers,
      pricing,
      payment,
      specialRequests
    });

    // Populate destination details
    await booking.populate('destination', 'name city country');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: { booking }
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during booking creation'
    });
  }
});

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    let query = { user: req.user.id };
    
    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookings = await Booking.find(query)
      .populate('destination', 'name city country images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.status(200).json({
      success: true,
      count: bookings.length,
      pagination: {
        current: parseInt(page),
        total: totalPages,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1,
        limit: parseInt(limit),
        totalResults: total
      },
      data: { bookings }
    });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('destination', 'name city country images coordinates')
      .populate('user', 'name email');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns the booking or is admin
    if (booking.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this booking'
      });
    }

    res.status(200).json({
      success: true,
      data: { booking }
    });
  } catch (error) {
    console.error('Get booking error:', error);
    
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private
router.put('/:id/status', protect, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns the booking or is admin
    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this booking'
      });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking status updated successfully',
      data: { booking }
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Cancel booking
// @route   DELETE /api/bookings/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Check if user owns the booking
    if (booking.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this booking'
      });
    }

    // Check if booking can be cancelled
    if (booking.status === 'completed' || booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This booking cannot be cancelled'
      });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings/admin/all
// @access  Private/Admin
router.get('/admin/all', protect, authorize('admin'), async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    let query = {};
    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const bookings = await Booking.find(query)
      .populate('user', 'name email')
      .populate('destination', 'name city country')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(query);
    const totalPages = Math.ceil(total / parseInt(limit));

    res.status(200).json({
      success: true,
      count: bookings.length,
      pagination: {
        current: parseInt(page),
        total: totalPages,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1,
        limit: parseInt(limit),
        totalResults: total
      },
      data: { bookings }
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;