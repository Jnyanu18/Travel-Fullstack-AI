import { useAuth } from '../context/AuthContext'

const Profile = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Profile</h1>
        <div className="bg-white rounded-lg shadow p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome, {user?.name}!</h2>
            <p className="text-gray-600">Email: {user?.email}</p>
            <p className="text-gray-600">Role: {user?.role}</p>
          </div>
          <p className="text-gray-600 text-center">
            Profile management, booking history, and preferences coming soon!
          </p>
        </div>
      </div>
    </div>
  )
}

export default Profile