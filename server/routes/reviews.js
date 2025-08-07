const express = require('express');
const Review = require('../models/Review');
const Destination = require('../models/Destination');
const Booking = require('../models/Booking');
const { protect, authorize } = require('../middleware/auth');
const { validateReview, handleValidationErrors } = require('../middleware/validation');

const router = express.Router();

// @desc    Get reviews for a destination
// @route   GET /api/reviews/destination/:destinationId
// @access  Public
router.get('/destination/:destinationId', async (req, res) => {
  try {
    const { page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    let sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const reviews = await Review.find({
      destination: req.params.destinationId,
      isApproved: true
    })
      .populate('user', 'name avatar')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({
      destination: req.params.destinationId,
      isApproved: true
    });

    const totalPages = Math.ceil(total / parseInt(limit));

    res.status(200).json({
      success: true,
      count: reviews.length,
      pagination: {
        current: parseInt(page),
        total: totalPages,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1,
        limit: parseInt(limit),
        totalResults: total
      },
      data: { reviews }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private
router.post('/', protect, validateReview, handleValidationErrors, async (req, res) => {
  try {
    const {
      destination,
      booking,
      rating,
      title,
      comment,
      pros,
      cons,
      ratings,
      travelDate,
      travelDuration,
      travelStyle
    } = req.body;

    // Check if destination exists
    const destinationExists = await Destination.findById(destination);
    if (!destinationExists) {
      return res.status(404).json({
        success: false,
        message: 'Destination not found'
      });
    }

    // Check if user already reviewed this destination
    const existingReview = await Review.findOne({
      user: req.user.id,
      destination
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this destination'
      });
    }

    // If booking is provided, verify it belongs to the user
    if (booking) {
      const bookingExists = await Booking.findOne({
        _id: booking,
        user: req.user.id
      });

      if (!bookingExists) {
        return res.status(403).json({
          success: false,
          message: 'Invalid booking reference'
        });
      }
    }

    // Create review
    const review = await Review.create({
      user: req.user.id,
      destination,
      booking,
      rating,
      title,
      comment,
      pros,
      cons,
      ratings,
      travelDate,
      travelDuration,
      travelStyle
    });

    // Update destination rating
    await updateDestinationRating(destination);

    // Populate user details
    await review.populate('user', 'name avatar');

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      data: { review }
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during review creation'
    });
  }
});

// @desc    Get user's reviews
// @route   GET /api/reviews/user
// @access  Private
router.get('/user', protect, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const reviews = await Review.find({ user: req.user.id })
      .populate('destination', 'name city country images')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Review.countDocuments({ user: req.user.id });
    const totalPages = Math.ceil(total / parseInt(limit));

    res.status(200).json({
      success: true,
      count: reviews.length,
      pagination: {
        current: parseInt(page),
        total: totalPages,
        hasNext: parseInt(page) < totalPages,
        hasPrev: parseInt(page) > 1,
        limit: parseInt(limit),
        totalResults: total
      },
      data: { reviews }
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns the review
    if (review.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('user', 'name avatar');

    // Update destination rating if rating changed
    if (req.body.rating && req.body.rating !== review.rating) {
      await updateDestinationRating(review.destination);
    }

    res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      data: { review: updatedReview }
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user owns the review or is admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    const destinationId = review.destination;
    await Review.findByIdAndDelete(req.params.id);

    // Update destination rating
    await updateDestinationRating(destinationId);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Mark review as helpful/unhelpful
// @route   POST /api/reviews/:id/helpful
// @access  Private
router.post('/:id/helpful', protect, async (req, res) => {
  try {
    const { isHelpful } = req.body;
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Check if user already marked this review
    const existingVote = review.helpful.find(
      h => h.user.toString() === req.user.id
    );

    if (existingVote) {
      existingVote.isHelpful = isHelpful;
    } else {
      review.helpful.push({
        user: req.user.id,
        isHelpful
      });
    }

    await review.save();

    res.status(200).json({
      success: true,
      message: 'Review helpfulness updated'
    });
  } catch (error) {
    console.error('Mark helpful error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Helper function to update destination rating
async function updateDestinationRating(destinationId) {
  try {
    const reviews = await Review.find({
      destination: destinationId,
      isApproved: true
    });

    if (reviews.length === 0) {
      await Destination.findByIdAndUpdate(destinationId, {
        'rating.average': 0,
        'rating.count': 0
      });
      return;
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviews.length;

    await Destination.findByIdAndUpdate(destinationId, {
      'rating.average': Math.round(averageRating * 10) / 10,
      'rating.count': reviews.length
    });
  } catch (error) {
    console.error('Update destination rating error:', error);
  }
}

module.exports = router;