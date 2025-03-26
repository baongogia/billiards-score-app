"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { fetchUserProfile, updateUser, type User } from "../../../services/Admin/User/userService"
import { ArrowLeft } from "lucide-react"
import EditUserProfileModal from "./EditUserProfileModal"
import { uploadAvatar } from "../../../services/Admin/User/avatarService" // Import the uploadAvatar function

export default function UserProfile() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const response = await fetchUserProfile(id!)
        if (response) {
          setUser(response)
        } else {
          setError("User not found")
        }
      } catch (error) {
        console.error("Error fetching user profile:", error)
        setError("Failed to load user profile.")
      } finally {
        setLoading(false)
      }
    }

    loadUserProfile()
  }, [id])

  const handleSaveUser = async (userData: Partial<User>) => {
    if (user) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, avatar, ...filteredData } = userData
        console.log("Data sent to API:", filteredData) // Kiểm tra dữ liệu trước khi gửi
        const updatedUser = await updateUser(user._id, filteredData)
        setUser(updatedUser)
        setIsEditModalOpen(false)
      } catch (error) {
        console.error("Error updating user:", error)
      }
    }
  }

  const handleChangeAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0] && user) {
      const file = event.target.files[0]
      try {
        const updatedUser = await uploadAvatar(user._id, file)
        setUser(updatedUser)
      } catch (error) {
        console.error("Error uploading avatar:", error)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="rounded-full bg-gray-300 dark:bg-gray-600 h-32 w-32 mb-4"></div>
          <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-48 mb-3"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-32 mb-2"></div>
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 text-red-700 dark:text-red-400 text-center">
        <svg
          className="w-6 h-6 mx-auto mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        {error}
      </div>
    )
  }

  if (!user) {
    return (
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 text-blue-700 dark:text-blue-400 text-center">
        <svg
          className="w-6 h-6 mx-auto mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        No user found.
      </div>
    )
  }

  // Status badge color based on status
  const getStatusColor = (status: string | undefined) => {
    if (!status) return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      case "inactive":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
      case "suspended":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
    }
  }

  // Role badge color
  const getRoleColor = (role: string | undefined) => {
    if (!role) return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
      case "manager":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
      case "user":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
    }
  }

  return (
    <div>
      <button
        onClick={() => navigate("/admin/users")}
        className="mb-4 flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to User List</span>
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-32 flex items-center justify-center relative">
          <div className="absolute -bottom-16">
            <div className="relative">
              <label htmlFor="avatarInput">
                <img
                  src={user.avatar || "/placeholder.svg"}
                  alt={`${user.name}'s avatar`}
                  className="w-32 h-32 rounded-full object-cover border-4 border-white dark:border-gray-800 cursor-pointer"
                />
              </label>
              <input
                type="file"
                id="avatarInput"
                accept="image/*"
                className="hidden"
                onChange={handleChangeAvatar}
              />
              <div
                className={`absolute bottom-3 right-3 w-4 h-4 rounded-full border-2 border-white ${
                  user.status?.toLowerCase() === "active" ? "bg-green-500" : "bg-gray-400"
                }`}
              ></div>
            </div>
          </div>
        </div>

        {/* User info */}
        <div className="pt-20 pb-8 px-6">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{user.name}</h2>
            <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg mx-auto">
            {/* Phone */}
            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex-shrink-0 mr-3">
                <svg
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Phone</div>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-200">{user.phone}</div>
              </div>
            </div>

            {/* Role */}
            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex-shrink-0 mr-3">
                <svg
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"
                  />
                </svg>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Role</div>
                <div className="mt-1">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}
                  >
                    {user.role}
                  </span>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg md:col-span-2">
              <div className="flex-shrink-0 mr-3">
                <svg
                  className="w-5 h-5 text-gray-500 dark:text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">Account Status</div>
                <div className="mt-1">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}
                  >
                    {user.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-6">
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      <EditUserProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveUser}
        user={user}
      />
    </div>
  )
}