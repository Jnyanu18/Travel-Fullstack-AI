import { Link } from 'react-router-dom'
import { Search, MapPin, Star, Users } from 'lucide-react'

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Discover Your Perfect Trip with AI
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200">
            Let artificial intelligence help you plan unforgettable journeys to amazing destinations
          </p>
          <div className="space-x-4">
            <Link to="/search" className="btn-primary text-lg px-8 py-3">
              Start Exploring
            </Link>
            <Link to="/plan" className="btn-outline border-white text-white hover:bg-white hover:text-gray-900 text-lg px-8 py-3">
              Plan Trip
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose TrueTrip AI?
            </h2>
            <p className="text-xl text-gray-600">
              Experience the future of travel planning
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered Search</h3>
              <p className="text-gray-600">
                Find destinations that match your preferences with intelligent recommendations
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Global Destinations</h3>
              <p className="text-gray-600">
                Explore thousands of destinations worldwide with detailed information
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Reviews</h3>
              <p className="text-gray-600">
                Read authentic reviews from real travelers to make informed decisions
              </p>
            </div>

            <div className="text-center">
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
              <p className="text-gray-600">
                Book your entire trip seamlessly with our integrated booking system
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of travelers who trust TrueTrip AI for their adventures
          </p>
          <Link to="/auth" className="btn-primary text-lg px-8 py-3">
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Home