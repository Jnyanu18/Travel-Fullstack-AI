import { useAuth } from '../context/AuthContext'

const AdminDashboard = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        <div className="bg-white rounded-lg shadow p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome, Admin {user?.name}!</h2>
            <p className="text-gray-600">Manage your travel platform from here.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-primary-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-primary-900">Destinations</h3>
              <p className="text-primary-600">Manage travel destinations</p>
            </div>
            <div className="bg-green-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-green-900">Bookings</h3>
              <p className="text-green-600">View and manage bookings</p>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-900">Users</h3>
              <p className="text-yellow-600">Manage user accounts</p>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-purple-900">Reviews</h3>
              <p className="text-purple-600">Moderate user reviews</p>
            </div>
          </div>
          <p className="text-gray-600 text-center mt-8">
            Full admin functionality coming soon!
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard