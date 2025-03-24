// TablesList.tsx
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Edit, Trash2, Plus, Eye } from "lucide-react";
import { fetchPoolTables, PoolTable, deletePoolTable, createPoolTable, updatePoolTable } from "../../../services/Admin/Tables/poolTableService";
import ViewTableModal from "./ViewTableModal";
import { CreateTableModal } from "./CreateTableModal";
import { EditTableModal } from "./EditTableModal";

export default function TablesList() {
  const [tables, setTables] = useState<PoolTable[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState<PoolTable | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("asc");
  const itemsPerPage = 10;

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    try {
      const data = await fetchPoolTables();
      setTables(data);
    } catch (error) {
      console.error("Error fetching tables:", error);
    }
  };

  const handleCreateTable = async (tableData: PoolTable) => {
    try {
      await createPoolTable(tableData);
      await loadTables();
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating table:", error);
    }
  };

  const handleEditTable = async (tableData: Partial<PoolTable>) => {
    if (!selectedTable?._id) return;
    try {
      await updatePoolTable(selectedTable._id, tableData);
      await loadTables();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating table:", error);
    }
  };

  const handleDelete = async (tableId: string) => {
    if (window.confirm("Are you sure you want to delete this table?")) {
      try {
        await deletePoolTable(tableId);
        await loadTables();
      } catch (error) {
        console.error("Error deleting table:", error);
      }
    }
  };

  const openEditModal = (table: PoolTable) => {
    setSelectedTable(table);
    setIsEditModalOpen(true);
  };

  const openViewModal = (table: PoolTable) => {
    setSelectedTable(table);
    setIsViewModalOpen(true);
  };

  const filteredTables = tables.filter((table) => {
    const matchesSearch = 
      table._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      table.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      table.tableType.type_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "" || table.status === statusFilter;
    const matchesType = typeFilter === "" || table.tableType.type_name === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Get unique table types for filter dropdown
  const tableTypes = Array.from(new Set(tables.map(table => table.tableType.type_name)));

  // Sort tables
  const sortedTables = [...filteredTables].sort((a, b) => {
    if (sortBy === "createdAt") {
      return sortDirection === "asc" 
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === "status") {
      return sortDirection === "asc"
        ? a.status.localeCompare(b.status)
        : b.status.localeCompare(a.status);
    }
    if (sortBy === "type") {
      return sortDirection === "asc"
        ? a.tableType.type_name.localeCompare(b.tableType.type_name)
        : b.tableType.type_name.localeCompare(a.tableType.type_name);
    }
    return 0;
  });

  const totalPages = Math.ceil(sortedTables.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTables = sortedTables.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "in_use":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      case "maintenance":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <div className="pb-3 border-b border-gray-200 dark:border-gray-700 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Billiard Tables</h2>
      </div>

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
        >
          <Plus className="mr-2" />
          Add New Table
        </button>

        {/* Filters Section */}
        <div className="flex flex-wrap gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Search tables..."
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border p-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="occupied">Occupied</option>
            <option value="maintenance">Maintenance</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border p-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All Types</option>
            {tableTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border p-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="createdAt">Created At</option>
              <option value="status">Status</option>
              <option value="type">Type</option>
            </select>

            <select
              value={sortDirection}
              onChange={(e) => setSortDirection(e.target.value)}
              className="border p-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tables Section */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedTables.map((table) => (
              <tr key={table._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  {table._id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(table.status)}`}>
                    {table.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  {table.tableType.type_name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => openViewModal(table)}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => openEditModal(table)}
                    className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 mr-4"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(table._id)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-4">
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
      )}

      {/* Modals */}
      <CreateTableModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTable}
      />

      <EditTableModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditTable}
        table={selectedTable}
      />

      <ViewTableModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        table={selectedTable}
      />
    </div>
  );
}