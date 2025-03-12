"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { fetchUsers, fetchManagersWithoutStore, fetchUserProfile, deleteUser, fetchInactiveUsers, User } from "../../../services/Admin/User/userService";

export default function UserTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const navigate = useNavigate();
  const [managersWithoutStore, setManagersWithoutStore] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const activeUsers = await fetchUsers();
        console.log("Active Users:", activeUsers); // Log active users to verify filtering
        console.log("Raw API Response:", activeUsers); // Log dữ liệu thô
        console.log("Total Users Returned:", activeUsers.length); // Log số lượng
        setUsers(activeUsers); // Filter users with role "manager" or "admin" and status "active"
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    loadUsers();
  }, []);

  const loadManagersWithoutStore = async () => {
    try {
      const managers = await fetchManagersWithoutStore();
      console.log("Managers Without Store:", managers);
      setManagersWithoutStore(managers);
      setIsModalOpen(true); // Open the modal
    } catch (error) {
      console.error("Error fetching managers without store:", error);
    }
  };

  const loadInactiveUsers = async () => {
    try {
      const inactiveUsers = await fetchInactiveUsers();
      console.log("Inactive Users:", inactiveUsers);
      setUsers(inactiveUsers);
    } catch (error) {
      console.error("Error fetching inactive users:", error);
    }
  };

  const filteredUsers = Array.isArray(users) ? users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm)
  ) : [];

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const handleView = async (id: string) => {
    try {
      const userProfile = await fetchUserProfile(id);
      console.log("User Profile:", userProfile);
      navigate(`/admin/user/${id}`);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);
      console.log(`User with ID: ${id} deleted`);
      setUsers(users.filter(user => user._id !== id));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300";
      case "manager":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      default:
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">User Management</h2>

        <div className="flex w-full sm:w-auto gap-3">
          <div className="relative flex-1 sm:flex-initial">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-gray-200"
            />
          </div>

          <button
            onClick={() => navigate("/admin/register")}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>New User</span>
          </button>
          <button
            onClick={loadManagersWithoutStore}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <span>Find Managers Without Store</span>
          </button>
          <button
            onClick={loadInactiveUsers}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            <span>Find Inactive Users</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700 border-y border-gray-200 dark:border-gray-600">
              <th className="text-left py-4 px-5 text-lg font-semibold text-gray-900 dark:text-gray-200">#</th>
              <th className="text-left py-4 px-5 text-lg font-semibold text-gray-900 dark:text-gray-200">Name</th>
              <th className="text-left py-4 px-5 text-lg font-semibold text-gray-900 dark:text-gray-200">Phone</th>
              <th className="text-left py-4 px-5 text-lg font-semibold text-gray-900 dark:text-gray-200">Email</th>
              <th className="text-left py-4 px-5 text-lg font-semibold text-gray-900 dark:text-gray-200">Role</th>
              <th className="text-right py-4 px-5 text-lg font-semibold text-gray-900 dark:text-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {paginatedUsers.map((user, index) => (
              <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="py-4 px-5 text-lg text-gray-600 dark:text-gray-300">{startIndex + index + 1}</td>
                <td className="py-4 px-5 text-lg text-gray-900 dark:text-gray-200 font-medium">{user.name}</td>
                <td className="py-4 px-5 text-lg text-gray-600 dark:text-gray-300">{user.phone}</td>
                <td className="py-4 px-5 text-lg text-gray-600 dark:text-gray-300">{user.email}</td>
                <td className="py-4 px-5">
                  <span
                    className={`inline-block px-3 py-2 rounded-full text-lg font-medium ${getRoleBadgeClass(user.role)}`}
                  >
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </span>
                </td>
                <td className="py-4 px-5 text-right space-x-2">
                  <button
                    onClick={() => handleView(user._id)}
                    className="px-4 py-2 text-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-md transition-colors"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="px-4 py-2 text-lg text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 rounded-md transition-colors"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-600 px-4 py-3 sm:px-6 mt-4">
          <div className="flex flex-1 justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-lg text-gray-700 dark:text-gray-300">
                Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredUsers.length)}</span> of{" "}
                <span className="font-medium">{filteredUsers.length}</span> results
              </p>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center rounded-md p-3 text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`relative inline-flex items-center px-4 py-2 text-lg font-medium rounded-md ${
                    currentPage === i + 1 ? "bg-blue-600 text-white" : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center rounded-md p-3 text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      )}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Managers Without Store</h2>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="w-6 h-6 text-gray-600 hover:text-red-500" />
              </button>
            </div>
            <div className="modal-body">
              {managersWithoutStore.length > 0 ? (
                <ul>
                  {managersWithoutStore.map((manager) => (
                    <li key={manager._id} className="border p-3 rounded-lg shadow-sm">
                      <p><strong>Name:</strong> {manager.name}</p>
                      <p><strong>Email:</strong> {manager.email}</p>
                      <p><strong>Manager ID:</strong> {manager._id}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No managers found.</p>
              )}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}