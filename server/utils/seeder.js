const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Destination = require('../models/Destination');
const Booking = require('../models/Booking');
const Review = require('../models/Review');

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@truetrip.com',
    password: 'Admin123!',
    role: 'admin',
    isVerified: true,
    preferences: {
      budget: { min: 0, max: 10000 },
      travelStyle: 'luxury',
      interests: ['culture', 'food', 'history']
    }
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'User123!',
    role: 'user',
    isVerified: true,
    preferences: {
      budget: { min: 500, max: 3000 },
      travelStyle: 'mid-range',
      interests: ['adventure', 'nature', 'culture']
    }
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'User123!',
    role: 'user',
    isVerified: true,
    preferences: {
      budget: { min: 200, max: 1500 },
      travelStyle: 'budget',
      interests: ['food', 'nightlife', 'art']
    }
  }
];

const destinations = [
  {
    name: 'Santorini Paradise',
    country: 'Greece',
    city: 'Santorini',
    description: 'Experience the breathtaking sunsets and iconic blue-domed churches of Santorini. This Greek island paradise offers stunning volcanic beaches, charming villages, and world-class wine.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2139&q=80',
        caption: 'Sunset view of Santorini'
      }
    ],
    coordinates: {
      type: 'Point',
      coordinates: [25.4615, 36.3932] // [longitude, latitude]
    },
    category: 'island',
    popularActivities: ['Wine tasting', 'Sunset watching', 'Boat tours', 'Beach relaxation'],
    bestTimeToVisit: {
      months: ['Apr', 'May', 'Jun', 'Sep', 'Oct'],
      description: 'Spring and early fall offer perfect weather with fewer crowds'
    },
    averageCost: {
      budget: 80,
      midRange: 200,
      luxury: 500
    },
    rating: {
      average: 4.8,
      count: 156
    },
    tags: ['romantic', 'sunset', 'wine', 'beaches'],
    featured: true
  },
  {
    name: 'Machu Picchu Trek',
    country: 'Peru',
    city: 'Cusco',
    description: 'Discover the ancient Incan citadel of Machu Picchu, one of the New Seven Wonders of the World. Trek through stunning mountain landscapes and immerse yourself in rich history.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2076&q=80',
        caption: 'Machu Picchu ancient ruins'
      }
    ],
    coordinates: {
      type: 'Point',
      coordinates: [-72.5450, -13.1631] // [longitude, latitude]
    },
    category: 'historical',
    popularActivities: ['Hiking', 'Photography', 'Cultural tours', 'Train rides'],
    bestTimeToVisit: {
      months: ['May', 'Jun', 'Jul', 'Aug', 'Sep'],
      description: 'Dry season offers clear skies and best hiking conditions'
    },
    averageCost: {
      budget: 60,
      midRange: 150,
      luxury: 400
    },
    rating: {
      average: 4.9,
      count: 243
    },
    tags: ['adventure', 'history', 'hiking', 'UNESCO'],
    featured: true
  },
  {
    name: 'Tokyo Urban Experience',
    country: 'Japan',
    city: 'Tokyo',
    description: 'Immerse yourself in the vibrant culture of Tokyo, where traditional temples meet futuristic skyscrapers. Experience incredible food, shopping, and nightlife.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2094&q=80',
        caption: 'Tokyo city skyline at night'
      }
    ],
    coordinates: {
      type: 'Point',
      coordinates: [139.6503, 35.6762] // [longitude, latitude]
    },
    category: 'city',
    popularActivities: ['Temple visits', 'Food tours', 'Shopping', 'Nightlife'],
    bestTimeToVisit: {
      months: ['Mar', 'Apr', 'May', 'Oct', 'Nov'],
      description: 'Spring cherry blossoms and autumn colors are spectacular'
    },
    averageCost: {
      budget: 70,
      midRange: 180,
      luxury: 450
    },
    rating: {
      average: 4.7,
      count: 189
    },
    tags: ['culture', 'food', 'technology', 'temples'],
    featured: true
  },
  {
    name: 'Sahara Desert Adventure',
    country: 'Morocco',
    city: 'Merzouga',
    description: 'Experience the magic of the Sahara Desert with camel treks, stargazing, and traditional Berber camps. Witness stunning sand dunes and unforgettable sunrises.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        caption: 'Sahara Desert sand dunes'
      }
    ],
    coordinates: {
      type: 'Point',
      coordinates: [-4.0133, 31.0801] // [longitude, latitude]
    },
    category: 'desert',
    popularActivities: ['Camel trekking', 'Stargazing', 'Desert camping', 'Photography'],
    bestTimeToVisit: {
      months: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
      description: 'Cooler months provide comfortable temperatures for desert activities'
    },
    averageCost: {
      budget: 40,
      midRange: 100,
      luxury: 300
    },
    rating: {
      average: 4.6,
      count: 98
    },
    tags: ['adventure', 'desert', 'camping', 'stargazing'],
    featured: false
  },
  {
    name: 'Bali Beach Resort',
    country: 'Indonesia',
    city: 'Bali',
    description: 'Relax on pristine beaches, explore ancient temples, and enjoy world-class spas in this tropical paradise. Perfect for both adventure and relaxation.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
        caption: 'Bali temple and beach view'
      }
    ],
    coordinates: {
      type: 'Point',
      coordinates: [115.0920, -8.3405] // [longitude, latitude]
    },
    category: 'beach',
    popularActivities: ['Beach relaxation', 'Temple visits', 'Spa treatments', 'Surfing'],
    bestTimeToVisit: {
      months: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      description: 'Dry season with perfect beach weather and clear skies'
    },
    averageCost: {
      budget: 35,
      midRange: 90,
      luxury: 250
    },
    rating: {
      average: 4.5,
      count: 167
    },
    tags: ['beach', 'temples', 'spa', 'tropical'],
    featured: true
  }
];

// Connect to database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Import data
const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Destination.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});

    console.log('🗑️  Cleared existing data');

    // Hash passwords for users
    for (let user of users) {
      const salt = await bcrypt.genSalt(12);
      user.password = await bcrypt.hash(user.password, salt);
    }

    // Insert users
    const createdUsers = await User.insertMany(users);
    console.log('👥 Users imported');

    // Insert destinations
    const createdDestinations = await Destination.insertMany(destinations);
    console.log('🏖️  Destinations imported');

    // Create sample bookings
    const sampleBookings = [
      {
        user: createdUsers[1]._id, // John Doe
        destination: createdDestinations[0]._id, // Santorini
        bookingType: 'package',
        details: {
          package: {
            name: 'Santorini Romantic Getaway',
            duration: 7,
            inclusions: ['Hotel accommodation', 'Daily breakfast', 'Wine tasting tour', 'Sunset cruise'],
            itinerary: [
              { day: 1, activities: ['Airport pickup', 'Hotel check-in'], meals: ['Dinner'] },
              { day: 2, activities: ['Oia village tour', 'Sunset viewing'], meals: ['Breakfast', 'Lunch'] }
            ]
          }
        },
        travelers: [
          { firstName: 'John', lastName: 'Doe', age: 32 },
          { firstName: 'Sarah', lastName: 'Doe', age: 29 }
        ],
        pricing: {
          basePrice: 1400,
          taxes: 200,
          fees: 50,
          totalPrice: 1650
        },
        payment: {
          method: 'credit_card',
          status: 'completed'
        },
        status: 'confirmed'
      }
    ];

    await Booking.insertMany(sampleBookings);
    console.log('📋 Bookings imported');

    // Create sample reviews
    const sampleReviews = [
      {
        user: createdUsers[1]._id, // John Doe
        destination: createdDestinations[0]._id, // Santorini
        rating: 5,
        title: 'Absolutely magical experience!',
        comment: 'Santorini exceeded all our expectations. The sunsets are breathtaking, the food is amazing, and the people are so welcoming. Perfect for a romantic getaway!',
        pros: ['Stunning sunsets', 'Great food', 'Friendly locals', 'Beautiful architecture'],
        cons: ['Can be crowded in summer', 'Expensive dining'],
        ratings: {
          accommodation: 5,
          food: 4,
          activities: 5,
          valueForMoney: 3
        },
        travelDate: new Date('2023-06-15'),
        travelDuration: 7,
        travelStyle: 'couple',
        isVerified: true
      },
      {
        user: createdUsers[2]._id, // Jane Smith
        destination: createdDestinations[1]._id, // Machu Picchu
        rating: 5,
        title: 'Life-changing adventure!',
        comment: 'The trek to Machu Picchu was challenging but absolutely worth it. The views are incredible and the history is fascinating. A must-do for any adventure traveler!',
        pros: ['Amazing views', 'Rich history', 'Great guides', 'Sense of achievement'],
        cons: ['Physically demanding', 'Altitude sickness risk'],
        ratings: {
          activities: 5,
          food: 4,
          transportation: 4,
          valueForMoney: 5
        },
        travelDate: new Date('2023-07-10'),
        travelDuration: 5,
        travelStyle: 'solo',
        isVerified: true
      }
    ];

    await Review.insertMany(sampleReviews);
    console.log('⭐ Reviews imported');

    console.log('✅ Data import completed successfully!');
    console.log(`
📊 Summary:
- ${createdUsers.length} users created
- ${createdDestinations.length} destinations created
- ${sampleBookings.length} bookings created
- ${sampleReviews.length} reviews created

🔐 Admin credentials:
Email: admin@truetrip.com
Password: Admin123!

👤 Test user credentials:
Email: john@example.com
Password: User123!
    `);

  } catch (error) {
    console.error('❌ Error importing data:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Delete data
const deleteData = async () => {
  try {
    await connectDB();
    
    await User.deleteMany({});
    await Destination.deleteMany({});
    await Booking.deleteMany({});
    await Review.deleteMany({});
    
    console.log('🗑️  All data deleted successfully!');
  } catch (error) {
    console.error('❌ Error deleting data:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Check command line arguments
if (process.argv[2] === '-d') {
  deleteData();
} else {
  importData();
}