const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
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
  bookingType: {
    type: String,
    enum: ['flight', 'hotel', 'package', 'activity'],
    required: true
  },
  details: {
    // Flight details
    flight: {
      airline: String,
      flightNumber: String,
      departure: {
        airport: String,
        date: Date,
        time: String
      },
      arrival: {
        airport: String,
        date: Date,
        time: String
      },
      class: {
        type: String,
        enum: ['economy', 'business', 'first']
      }
    },
    // Hotel details
    hotel: {
      name: String,
      address: String,
      checkIn: Date,
      checkOut: Date,
      roomType: String,
      guests: Number
    },
    // Package details
    package: {
      name: String,
      duration: Number, // days
      inclusions: [String],
      itinerary: [{
        day: Number,
        activities: [String],
        meals: [String]
      }]
    },
    // Activity details
    activity: {
      name: String,
      date: Date,
      time: String,
      duration: Number, // hours
      participants: Number
    }
  },
  travelers: [{
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    age: Number,
    passportNumber: String,
    nationality: String
  }],
  pricing: {
    basePrice: { type: Number, required: true },
    taxes: { type: Number, default: 0 },
    fees: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true }
  },
  payment: {
    method: {
      type: String,
      enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paidAt: Date
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
    default: 'pending'
  },
  specialRequests: String,
  confirmationNumber: {
    type: String,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Generate confirmation number before saving
bookingSchema.pre('save', function(next) {
  if (!this.confirmationNumber) {
    this.confirmationNumber = 'TT' + Date.now() + Math.random().toString(36).substr(2, 5).toUpperCase();
  }
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);