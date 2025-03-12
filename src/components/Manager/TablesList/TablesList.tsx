"use client"

import { useState, useEffect } from "react"
import { Search, ChevronLeft, ChevronRight, Plus, Filter, X } from "lucide-react"

// Define the Table type
interface Table {
  id: string
  tableNumber: number
  type: string
  status: "available" | "occupied" | "maintenance"
  hourlyRate: number
  lastMaintenance: string
  location: string
}

// Mock service function - replace with actual API calls
const fetchTables = async (): Promise<Table[]> => {
  // Simulate API call
  return [
    {
      id: "1",
      tableNumber: 1,
      type: "Standard",
      status: "available",
      hourlyRate: 15,
      lastMaintenance: "2023-12-01",
      location: "Main Hall",
    },
    {
      id: "2",
      tableNumber: 2,
      type: "Premium",
      status: "occupied",
      hourlyRate: 25,
      lastMaintenance: "2023-12-05",
      location: "Main Hall",
    },
    {
      id: "3",
      tableNumber: 3,
      type: "Standard",
      status: "available",
      hourlyRate: 15,
      lastMaintenance: "2023-11-28",
      location: "Main Hall",
    },
    {
      id: "4",
      tableNumber: 4,
      type: "Snooker",
      status: "maintenance",
      hourlyRate: 20,
      lastMaintenance: "2023-12-10",
      location: "VIP Room",
    },
    {
      id: "5",
      tableNumber: 5,
      type: "Premium",
      status: "available",
      hourlyRate: 25,
      lastMaintenance: "2023-12-03",
      location: "VIP Room",
    },
    {
      id: "6",
      tableNumber: 6,
      type: "Standard",
      status: "occupied",
      hourlyRate: 15,
      lastMaintenance: "2023-11-25",
      location: "Main Hall",
    },
    {
      id: "7",
      tableNumber: 7,
      type: "Snooker",
      status: "available",
      hourlyRate: 20,
      lastMaintenance: "2023-12-07",
      location: "VIP Room",
    },
    {
      id: "8",
      tableNumber: 8,
      type: "Premium",
      status: "occupied",
      hourlyRate: 25,
      lastMaintenance: "2023-12-02",
      location: "Main Hall",
    },
  ]
}

export default function TablesList() {
  const [tables, setTables] = useState<Table[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [typeFilter, setTypeFilter] = useState<string | null>(null)
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false)
  const itemsPerPage = 5

  useEffect(() => {
    const loadTables = async () => {
      try {
        const data = await fetchTables()
        setTables(data)
      } catch (error) {
        console.error("Error fetching tables:", error)
      }
    }

    loadTables()
  }, [])

  const filteredTables = tables.filter((table) => {
    const matchesSearch =
      table.tableNumber.toString().includes(searchTerm) ||
      table.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      table.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter ? table.status === statusFilter : true
    const matchesType = typeFilter ? table.type === typeFilter : true

    return matchesSearch && matchesStatus && matchesType
  })

  const totalPages = Math.ceil(filteredTables.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedTables = filteredTables.slice(startIndex, startIndex + itemsPerPage)

  const handleBookTable = (id: string) => {
    // Implement booking functionality
    console.log(`Booking table with ID: ${id}`)
  }

  const handleMaintenanceRequest = (id: string) => {
    // Implement maintenance request functionality
    console.log(`Maintenance request for table with ID: ${id}`)
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
      case "occupied":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
      case "maintenance":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case "Premium":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
      case "Snooker":
        return "bg-rose-100 text-rose-700 dark:bg-rose-900 dark:text-rose-300"
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300"
    }
  }

  const clearFilters = () => {
    setStatusFilter(null)
    setTypeFilter(null)
  }

  const toggleFilterMenu = () => {
    setIsFilterMenuOpen(!isFilterMenuOpen)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="pb-3 border-b border-gray-200 dark:border-gray-700 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Billiard Tables</h2>
      </div>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
          <input
            type="text"
            placeholder="Search tables..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none dark:bg-gray-700 dark:text-gray-200 py-2 px-4"
          />
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <button
              onClick={toggleFilterMenu}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200"
            >
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>

            {isFilterMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
                <div className="py-1">
                  <button
                    onClick={() => {
                      setStatusFilter("available")
                      setIsFilterMenuOpen(false)
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Available
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter("occupied")
                      setIsFilterMenuOpen(false)
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Occupied
                  </button>
                  <button
                    onClick={() => {
                      setStatusFilter("maintenance")
                      setIsFilterMenuOpen(false)
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Maintenance
                  </button>
                  <hr className="my-1 border-gray-200 dark:border-gray-700" />
                  <button
                    onClick={() => {
                      setTypeFilter("Standard")
                      setIsFilterMenuOpen(false)
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Standard Tables
                  </button>
                  <button
                    onClick={() => {
                      setTypeFilter("Premium")
                      setIsFilterMenuOpen(false)
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Premium Tables
                  </button>
                  <button
                    onClick={() => {
                      setTypeFilter("Snooker")
                      setIsFilterMenuOpen(false)
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Snooker Tables
                  </button>
                  <hr className="my-1 border-gray-200 dark:border-gray-700" />
                  <button
                    onClick={() => {
                      clearFilters()
                      setIsFilterMenuOpen(false)
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </div>

          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="h-4 w-4" />
            <span>Add Table</span>
          </button>
        </div>
      </div>

      {/* Active Filters */}
      {(statusFilter || typeFilter) && (
        <div className="flex gap-2 mb-4">
          {statusFilter && (
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200">
              Status: {statusFilter}
              <button onClick={() => setStatusFilter(null)} className="ml-1 hover:text-red-500">
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {typeFilter && (
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200">
              Type: {typeFilter}
              <button onClick={() => setTypeFilter(null)} className="ml-1 hover:text-red-500">
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700 border-y border-gray-200 dark:border-gray-600">
              <th className="text-left py-4 px-5 text-sm font-semibold text-gray-900 dark:text-gray-200">Table #</th>
              <th className="text-left py-4 px-5 text-sm font-semibold text-gray-900 dark:text-gray-200">Type</th>
              <th className="text-left py-4 px-5 text-sm font-semibold text-gray-900 dark:text-gray-200">Status</th>
              <th className="text-left py-4 px-5 text-sm font-semibold text-gray-900 dark:text-gray-200">
                Hourly Rate
              </th>
              <th className="text-left py-4 px-5 text-sm font-semibold text-gray-900 dark:text-gray-200">Location</th>
              <th className="text-left py-4 px-5 text-sm font-semibold text-gray-900 dark:text-gray-200">
                Last Maintenance
              </th>
              <th className="text-right py-4 px-5 text-sm font-semibold text-gray-900 dark:text-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {paginatedTables.map((table) => (
              <tr key={table.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="py-4 px-5 text-gray-900 dark:text-gray-200 font-medium">{table.tableNumber}</td>
                <td className="py-4 px-5">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getTypeBadgeClass(table.type)}`}
                  >
                    {table.type}
                  </span>
                </td>
                <td className="py-4 px-5">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(table.status)}`}
                  >
                    {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
                  </span>
                </td>
                <td className="py-4 px-5 text-gray-900 dark:text-gray-200">${table.hourlyRate}/hr</td>
                <td className="py-4 px-5 text-gray-900 dark:text-gray-200">{table.location}</td>
                <td className="py-4 px-5 text-gray-600 dark:text-gray-400">
                  {new Date(table.lastMaintenance).toLocaleDateString()}
                </td>
                <td className="py-4 px-5 text-right space-x-2">
                  {table.status === "available" ? (
                    <button
                      onClick={() => handleBookTable(table.id)}
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Book
                    </button>
                  ) : (
                    <button
                      disabled={table.status === "maintenance"}
                      className={`px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg ${
                        table.status === "maintenance"
                          ? "opacity-50 cursor-not-allowed text-gray-500 dark:text-gray-400"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      {table.status === "occupied" ? "Occupied" : "In Maintenance"}
                    </button>
                  )}
                  <button
                    onClick={() => handleMaintenanceRequest(table.id)}
                    className="ml-2 px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Maintenance
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
              className={`relative inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 ${
                currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredTables.length)}</span> of{" "}
                <span className="font-medium">{filteredTables.length}</span> tables
              </p>
            </div>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-600 ${
                  currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`relative inline-flex items-center justify-center w-10 h-10 rounded-md ${
                    currentPage === i + 1
                      ? "bg-blue-600 text-white"
                      : "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={currentPage === totalPages}
                className={`relative inline-flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-600 ${
                  currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

