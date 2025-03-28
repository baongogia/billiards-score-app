"use client"

import type React from "react"
import { useContext, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import {  User, Store, LogOut, Menu, X, Database, LaptopMinimalCheck, Table } from "lucide-react"
import { AuthContext } from "../../context/AuthContext"

const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()
  const auth = useContext(AuthContext)

  const user = {
    name: "Admin",
    avatar: "../../assets/images/file.svg",
  }

  const navItems = [
    { path: "/admin", icon: Database, label: "Dashboard" },
    { path: "/admin/users", icon: User, label: "Users" },
    { path: "/admin/stores", icon: Store, label: "Stores" },
    { path: "/admin/matches", icon: LaptopMinimalCheck, label: "Matches" },
    { path: "/admin/tables", icon: Table, label: "Tables" },
  ]

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const handleLogout = () => {
    auth?.logout()
    navigate("/")
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <nav
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 fixed lg:relative inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out h-full`}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <Link to="/HomePage" className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                <Database className="w-5 h-5 text-indigo-600" />
              </div>
              <span className="ml-3 text-lg font-semibold text-gray-800">
                Billiard Club
              </span>
            </Link>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1 rounded-md hover:bg-gray-100 lg:hidden"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 py-6 px-4 overflow-y-auto">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 ${
                      isActive(item.path)
                        ? "bg-indigo-50 text-indigo-700 font-medium"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <item.icon
                      className={`w-5 h-5 ${
                        isActive(item.path)
                          ? "text-indigo-600"
                          : "text-gray-500"
                      }`}
                    />
                    <span>{item.label}</span>
                    {isActive(item.path) && (
                      <div className="ml-auto w-1.5 h-5 bg-indigo-600 rounded-full"></div>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 border-t border-gray-100">
            <div className="bg-indigo-50 rounded-lg p-4">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {user.name}
                  </p>
                  <p className="text-xs text-gray-500">Admin</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-indigo-700 bg-white rounded-md border border-indigo-200 hover:bg-indigo-100 transition-colors duration-200"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile sidebar toggle */}
      <div className="fixed bottom-4 left-4 z-40 lg:hidden">
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-colors"
          >
            <Menu size={24} />
          </button>
        )}
      </div>

      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="h-full p-6">{children}</div>
      </main>
    </div>
  );
}

export default AdminLayout