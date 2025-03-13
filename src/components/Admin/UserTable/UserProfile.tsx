import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { fetchUserProfile, User } from "../../../services/Admin/User/userService"

export default function UserProfile() {
  const { id } = useParams<{ id: string }>()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const data = await fetchUserProfile(id!)
        setUser(data.data)
      } catch (error) {
        console.error("Error fetching user profile:", error)
        setError("Failed to load user profile.")
      } finally {
        setLoading(false)
      }
    }

    loadUserProfile()
  }, [id])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  if (!user) {
    return <div>No user found.</div>
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="pb-3 border-b border-gray-200 dark:border-gray-700 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">User Profile</h2>
      </div>
      <div className="flex flex-col items-center">
        <img
          src={user.avatar}
          alt="User Avatar"
          className="w-32 h-32 rounded-full object-cover mb-4"
        />
        <div className="text-lg font-medium text-gray-900 dark:text-gray-200 mb-2">{user.name}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{user.email}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">{user.phone}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Role: {user.role}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">Status: {user.status}</div>
      </div>
    </div>
  )
}