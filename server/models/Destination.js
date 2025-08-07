const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide destination name'],
    trim: true
  },
  country: {
    type: String,
    required: [true, 'Please provide country'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'Please provide city'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please provide description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  images: [{
    url: String,
    caption: String
  }],
  coordinates: {
    latitude: {
      type: Number,
      required: true
    },
    longitude: {
      type: Number,
      required: true
    }
  },
  category: {
    type: String,
    enum: ['beach', 'mountain', 'city', 'desert', 'forest', 'island', 'historical', 'cultural'],
    required: true
  },
  popularActivities: [{
    type: String
  }],
  bestTimeToVisit: {
    months: [{
      type: String,
      enum: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    }],
    description: String
  },
  averageCost: {
    budget: { type: Number, default: 50 },
    midRange: { type: Number, default: 150 },
    luxury: { type: Number, default: 400 }
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  tags: [{
    type: String
  }],
  featured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for geospatial queries
destinationSchema.index({ coordinates: '2dsphere' });

// Text index for search
destinationSchema.index({
  name: 'text',
  country: 'text',
  city: 'text',
  description: 'text',
  tags: 'text'
});

module.exports = mongoose.model('Destination', destinationSchema);