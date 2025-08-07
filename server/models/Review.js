const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination',
    required: true
  },
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking'
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a rating'],
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: [true, 'Please provide a review title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  comment: {
    type: String,
    required: [true, 'Please provide a review comment'],
    maxlength: [1000, 'Comment cannot be more than 1000 characters']
  },
  pros: [{
    type: String,
    maxlength: [200, 'Pro cannot be more than 200 characters']
  }],
  cons: [{
    type: String,
    maxlength: [200, 'Con cannot be more than 200 characters']
  }],
  images: [{
    url: String,
    caption: String
  }],
  ratings: {
    accommodation: { type: Number, min: 1, max: 5 },
    food: { type: Number, min: 1, max: 5 },
    transportation: { type: Number, min: 1, max: 5 },
    activities: { type: Number, min: 1, max: 5 },
    valueForMoney: { type: Number, min: 1, max: 5 }
  },
  travelDate: {
    type: Date,
    required: true
  },
  travelDuration: {
    type: Number, // days
    required: true
  },
  travelStyle: {
    type: String,
    enum: ['solo', 'couple', 'family', 'friends', 'business'],
    required: true
  },
  helpful: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    isHelpful: Boolean
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Prevent duplicate reviews from same user for same destination
reviewSchema.index({ user: 1, destination: 1 }, { unique: true });

// Calculate helpfulness score
reviewSchema.virtual('helpfulnessScore').get(function() {
  if (this.helpful.length === 0) return 0;
  const helpfulCount = this.helpful.filter(h => h.isHelpful).length;
  return (helpfulCount / this.helpful.length) * 100;
});

module.exports = mongoose.model('Review', reviewSchema);