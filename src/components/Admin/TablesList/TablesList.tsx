import { useState, useEffect } from "react"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { fetchPoolTables, PoolTable } from "../../../services/Admin/Tables/poolTableService"

export default function TablesList() {
  const [tables, setTables] = useState<PoolTable[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  useEffect(() => {
    const loadTables = async () => {
      try {
        const data = await fetchPoolTables()
        setTables(data)
      } catch (error) {
        console.error("Error fetching tables:", error)
      }
    }

    loadTables()
  }, [])

  const filteredTables = tables.filter((table) => {
    const matchesSearch =
      table._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      table.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      table.tableType.type_name.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const totalPages = Math.ceil(filteredTables.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedTables = filteredTables.slice(startIndex, startIndex + itemsPerPage)

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
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700 border-y border-gray-200 dark:border-gray-600">
              <th className="text-left py-4 px-5 text-sm font-semibold text-gray-900 dark:text-gray-200">ID</th>
              <th className="text-left py-4 px-5 text-sm font-semibold text-gray-900 dark:text-gray-200">Status</th>
              <th className="text-left py-4 px-5 text-sm font-semibold text-gray-900 dark:text-gray-200">Type</th>
              <th className="text-left py-4 px-5 text-sm font-semibold text-gray-900 dark:text-gray-200">Compatible Modes</th>
              <th className="text-left py-4 px-5 text-sm font-semibold text-gray-900 dark:text-gray-200">Created At</th>
              <th className="text-left py-4 px-5 text-sm font-semibold text-gray-900 dark:text-gray-200">QR Code</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {paginatedTables.map((table) => (
              <tr key={table._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="py-4 px-5 text-gray-900 dark:text-gray-200 font-medium">
                  {table._id.substring(0, 8)}...
                </td>
                <td className="py-4 px-5">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(table.status)}`}
                  >
                    {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
                  </span>
                </td>
                <td className="py-4 px-5 text-gray-900 dark:text-gray-200">
                  {table.tableType.type_name}
                </td>
                <td className="py-4 px-5 text-gray-900 dark:text-gray-200">
                  {table.tableType.compatible_mode.join(", ")}
                </td>
                <td className="py-4 px-5 text-gray-600 dark:text-gray-400">
                  {new Date(table.createdAt).toLocaleDateString()}
                </td>
                <td className="py-4 px-5">
                  <a href={table.qrCodeImg} target="_blank" rel="noopener noreferrer">
                    <img 
                      src={table.qrCodeImg} 
                      alt="QR Code" 
                      className="w-10 h-10 object-contain"
                    />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-600 px-4 py-3 sm:px-6 mt-4">
          <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700 dark:text-gray-300">
                Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                <span className="font-medium">{Math.min(startIndex + itemsPerPage, filteredTables.length)}</span> of{" "}
                <span className="font-medium">{filteredTables.length}</span> results
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
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
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
    </div>
  )
}