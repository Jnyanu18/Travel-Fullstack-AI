const { body, param, query, validationResult } = require('express-validator');

// Handle validation errors
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User validation rules
exports.validateRegister = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number')
];

exports.validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Booking validation rules
exports.validateBooking = [
  body('destination')
    .isMongoId()
    .withMessage('Please provide a valid destination ID'),
  body('bookingType')
    .isIn(['flight', 'hotel', 'package', 'activity'])
    .withMessage('Please provide a valid booking type'),
  body('travelers')
    .isArray({ min: 1 })
    .withMessage('At least one traveler is required'),
  body('travelers.*.firstName')
    .trim()
    .notEmpty()
    .withMessage('Traveler first name is required'),
  body('travelers.*.lastName')
    .trim()
    .notEmpty()
    .withMessage('Traveler last name is required'),
  body('pricing.basePrice')
    .isNumeric()
    .withMessage('Base price must be a number'),
  body('pricing.totalPrice')
    .isNumeric()
    .withMessage('Total price must be a number')
];

// Review validation rules
exports.validateReview = [
  body('destination')
    .isMongoId()
    .withMessage('Please provide a valid destination ID'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Review title is required')
    .isLength({ max: 100 })
    .withMessage('Title cannot exceed 100 characters'),
  body('comment')
    .trim()
    .notEmpty()
    .withMessage('Review comment is required')
    .isLength({ max: 1000 })
    .withMessage('Comment cannot exceed 1000 characters'),
  body('travelDate')
    .isISO8601()
    .withMessage('Please provide a valid travel date'),
  body('travelDuration')
    .isInt({ min: 1 })
    .withMessage('Travel duration must be at least 1 day'),
  body('travelStyle')
    .isIn(['solo', 'couple', 'family', 'friends', 'business'])
    .withMessage('Please provide a valid travel style')
];

// Search validation rules
exports.validateSearch = [
  query('destination')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Destination must be at least 2 characters'),
  query('category')
    .optional()
    .isIn(['beach', 'mountain', 'city', 'desert', 'forest', 'island', 'historical', 'cultural'])
    .withMessage('Please provide a valid category'),
  query('minPrice')
    .optional()
    .isNumeric()
    .withMessage('Minimum price must be a number'),
  query('maxPrice')
    .optional()
    .isNumeric()
    .withMessage('Maximum price must be a number'),
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50')
];