"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Search, ChevronLeft, ChevronRight, Plus, X } from "lucide-react"
import {
  fetchManagersWithoutStore,
  fetchUserProfile,
  deleteUser,
  type User,
  fetchFilteredUsers,
} from "../../../services/Admin/User/userService"

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const navigate = useNavigate()
  const [managersWithoutStore, setManagersWithoutStore] = useState<User[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  //#region query
  const [searchTerm, setSearchTerm] = useState("")
  const [role, setRole] = useState("")
  const [status, setStatus] = useState("")
  const [sortBy, setSortBy] = useState("createdAt")
  const [sortDirection, setSortDirection] = useState("asc")
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10
  //#endregion

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true)
      try {
        const response = await fetchFilteredUsers(
          searchTerm,
          role,
          status,
          currentPage,
          pageSize,
          sortBy,
          sortDirection
        )
        setUsers(response.data)
        setTotalItems(response.pagination.totalItem)
      } catch (error) {
        console.error("Error fetching users:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUsers()
  }, [searchTerm, role, status, currentPage, sortBy, sortDirection])

  const loadManagersWithoutStore = async () => {
    try {
      const managers = await fetchManagersWithoutStore()
      setManagersWithoutStore(managers)
      setIsModalOpen(true)
    } catch (error) {
      console.error("Error fetching managers without store:", error)
    }
  }

  const handleView = async (id: string) => {
    try {
      await fetchUserProfile(id)
      navigate(`/admin/user/${id}`)
    } catch (error) {
      console.error("Error fetching user profile:", error)
    }
  }

  const confirmDelete = (id: string) => {
    setUserToDelete(id)
    setIsDeleteModalOpen(true)
  }

  const handleDelete = async () => {
    if (!userToDelete) return

    try {
      await deleteUser(userToDelete)
      setIsDeleteModalOpen(false)

      const response = await fetchFilteredUsers(
        searchTerm,
        role,
        status,
        currentPage,
        pageSize,
        sortBy,
        sortDirection
      )
      setUsers(response.data)
      setTotalItems(response.pagination.totalItem)

      if (response.data.length === 0 && currentPage > 1) {
        setCurrentPage(currentPage - 1)
      }
    } catch (error) {
      console.error("Error deleting user:", error)
    }
  }

  const getRoleBadgeClass = (role: string) => {
    switch (role.toLowerCase()) {
      case "admin":
        return "bg-gradient-to-r from-rose-500 to-pink-500 text-white"
      case "manager":
        return "bg-gradient-to-r from-emerald-500 to-teal-500 text-white"
      default:
        return "bg-gradient-to-r from-blue-500 to-indigo-500 text-white"
    }
  }

  const getStatusIndicator = (status: string) => {
    return status.toLowerCase() === "active" ? "bg-green-500" : "bg-gray-400"
  }

  const totalPages = Math.ceil(totalItems / pageSize)

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
      {/* Header Section */}
      <div className="flex flex-col gap-6 mb-8">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">User Management</h2>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/admin/register")}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
            >
              <Plus className="h-5 w-5" />
              <span className="font-medium">New User</span>
            </button>
            <button
              onClick={loadManagersWithoutStore}
              className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg hover:from-emerald-700 hover:to-teal-700 transition-all shadow-md hover:shadow-lg"
            >
              <span className="font-medium">Find Managers</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 justify-start">
          <div className="relative lg:col-span-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-3 w-full border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-gray-200 transition-all"
            />
          </div>

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="user">User</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            >
              <option value="createdAt">Created At</option>
              <option value="name">Name</option>
              <option value="email">Email</option>
            </select>

            <select
              value={sortDirection}
              onChange={(e) => setSortDirection(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700">
                <th className="text-left py-4 px-5 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  #
                </th>
                <th className="text-left py-4 px-5 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Name
                </th>
                <th className="text-left py-4 px-5 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Phone
                </th>
                <th className="text-left py-4 px-5 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="text-left py-4 px-5 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Role
                </th>
                <th className="text-right py-4 px-5 text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {isLoading ? (
                Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <tr key={index} className="animate-pulse">
                      <td className="py-4 px-5">
                        <div className="h-6 w-6 bg-gray-200 dark:bg-gray-600 rounded"></div>
                      </td>
                      <td className="py-4 px-5">
                        <div className="h-6 w-32 bg-gray-200 dark:bg-gray-600 rounded"></div>
                      </td>
                      <td className="py-4 px-5">
                        <div className="h-6 w-24 bg-gray-200 dark:bg-gray-600 rounded"></div>
                      </td>
                      <td className="py-4 px-5">
                        <div className="h-6 w-40 bg-gray-200 dark:bg-gray-600 rounded"></div>
                      </td>
                      <td className="py-4 px-5">
                        <div className="h-6 w-20 bg-gray-200 dark:bg-gray-600 rounded"></div>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <div className="h-6 w-24 bg-gray-200 dark:bg-gray-600 rounded ml-auto"></div>
                      </td>
                    </tr>
                  ))
              ) : users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="py-4 px-5 text-gray-600 dark:text-gray-300">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium">
                        {(currentPage - 1) * pageSize + index + 1}
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 flex items-center justify-center text-gray-700 dark:text-gray-300 font-bold text-lg">
                            {user.name.charAt(0)}
                          </div>
                          <div
                            className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white dark:border-gray-800 ${getStatusIndicator(user.status)}`}
                          ></div>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 dark:text-white">{user.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{user.status}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5 text-gray-600 dark:text-gray-300">{user.phone || "N/A"}</td>
                    <td className="py-4 px-5 text-gray-600 dark:text-gray-300">{user.email || "N/A"}</td>
                    <td className="py-4 px-5">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeClass(user.role)}`}
                      >
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleView(user._id)}
                          className="px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => confirmDelete(user._id)}
                          className="px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 px-5 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center">
                      <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                      <p className="text-lg font-medium">No users found</p>
                      <p className="text-sm">Try adjusting your search or filter to find what you're looking for.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="flex items-center justify-between px-4 py-5 mt-6">
          <div className="hidden sm:block">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Showing <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> to{" "}
              <span className="font-medium">{Math.min(currentPage * pageSize, totalItems)}</span> of{" "}
              <span className="font-medium">{totalItems}</span> results
            </p>
          </div>
          <div className="flex gap-1 mx-auto sm:mx-0">
            <button
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center justify-center w-10 h-10 rounded-lg text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {totalPages <= 7 ? (
              [...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`relative inline-flex items-center justify-center w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  {i + 1}
                </button>
              ))
            ) : (
              <>
                {/* First page */}
                <button
                  onClick={() => setCurrentPage(1)}
                  className={`relative inline-flex items-center justify-center w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === 1
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  1
                </button>

                {/* Ellipsis if needed */}
                {currentPage > 3 && (
                  <span className="relative inline-flex items-center justify-center w-10 h-10 text-gray-500 dark:text-gray-400">
                    ...
                  </span>
                )}

                {/* Pages around current */}
                {[...Array(totalPages)].map((_, i) => {
                  const pageNum = i + 1
                  if (
                    pageNum !== 1 &&
                    pageNum !== totalPages &&
                    pageNum >= currentPage - 1 &&
                    pageNum <= currentPage + 1
                  ) {
                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`relative inline-flex items-center justify-center w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === pageNum
                            ? "bg-blue-600 text-white"
                            : "text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  }
                  return null
                })}

                {/* Ellipsis if needed */}
                {currentPage < totalPages - 2 && (
                  <span className="relative inline-flex items-center justify-center w-10 h-10 text-gray-500 dark:text-gray-400">
                    ...
                  </span>
                )}

                {/* Last page */}
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  className={`relative inline-flex items-center justify-center w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === totalPages
                      ? "bg-blue-600 text-white"
                      : "text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  {totalPages}
                </button>
              </>
            )}

            <button
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center justify-center w-10 h-10 rounded-lg text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Managers Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4 overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Managers Without Store</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-5 max-h-[60vh] overflow-y-auto">
              {managersWithoutStore.length > 0 ? (
                <ul className="space-y-3">
                  {managersWithoutStore.map((manager) => (
                    <li
                      key={manager._id}
                      className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold">
                          {manager.name.charAt(0)}
                        </div>
                        <div className="font-medium text-gray-900 dark:text-white">{manager.name}</div>
                      </div>
                      <div className="grid grid-cols-1 gap-1 text-sm pl-13">
                        <p className="text-gray-600 dark:text-gray-300">
                          <span className="font-medium text-gray-700 dark:text-gray-200">Email:</span>{" "}
                          {manager.email || "N/A"}
                        </p>
                        <p className="text-gray-600 dark:text-gray-300">
                          <span className="font-medium text-gray-700 dark:text-gray-200">ID:</span> {manager._id}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                    <Search className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-lg font-medium text-gray-900 dark:text-white">No managers found</p>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    All managers are currently assigned to stores.
                  </p>
                </div>
              )}
            </div>
            <div className="p-5 border-t border-gray-200 dark:border-gray-700 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden border border-gray-200 dark:border-gray-700">
            <div className="p-5 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Confirm Deletion</h2>
            </div>
            <div className="p-5">
              <div className="flex items-center gap-4 mb-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <X className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div>
                  <p className="text-gray-700 dark:text-gray-300">
                    Are you sure you want to delete this user? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-5 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}