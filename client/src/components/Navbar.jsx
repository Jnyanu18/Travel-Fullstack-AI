import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Plane, User, LogOut, Settings } from 'lucide-react'

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Plane className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">TrueTrip AI</span>
            </Link>
          </div>

          <div className="flex items-center space-x-8">
            <Link to="/search" className="text-gray-700 hover:text-primary-600 transition-colors">
              Search
            </Link>
            <Link to="/plan" className="text-gray-700 hover:text-primary-600 transition-colors">
              Plan Trip
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <Link to="/profile" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors">
                  <User className="h-4 w-4" />
                  <span>{user?.name}</span>
                </Link>
                
                {user?.role === 'admin' && (
                  <Link to="/admin" className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors">
                    <Settings className="h-4 w-4" />
                    <span>Admin</span>
                  </Link>
                )}
                
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="btn-primary"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar