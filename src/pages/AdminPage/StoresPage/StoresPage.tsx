import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deleteStore, updateStore, Store, fetchFilteredStores } from "../../../services/Admin/Store/storeService";
import AppLayout from "../AdminLayout";
import StoreProfileModal from "../../../components/Admin/StoreTable/StoreProfileModal";
import EditStoreModal from "../../../components/Admin/StoreTable/EditStoreModal";
import StoreTablesModal from "../../../components/Admin/StoreTable/StoreTablesModal";
import { Plus, Search, Eye, Edit, Trash2, Table2, ChevronLeft, ChevronRight } from "lucide-react";

const StoreManagement: React.FC = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState<Store[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination and filtering states
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modal states
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTablesModalOpen, setIsTablesModalOpen] = useState(false);
  const [selectedTableStoreId, setSelectedTableStoreId] = useState<string | null>(null);

  useEffect(() => {
    const loadStores = async () => {
      setIsLoading(true);
      try {
        const response = await fetchFilteredStores(
          searchTerm,
          status,
          currentPage,
          pageSize,
          sortBy,
          sortDirection
        );
        setStores(response.data);
        setTotalItems(response.pagination.totalItem);
      } catch (error) {
        console.error("Error fetching stores:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStores();
  }, [searchTerm, status, currentPage, sortBy, sortDirection]);

  const handleDeleteStore = async (storeId: string) => {
    try {
      await deleteStore(storeId);
      setStores(stores.filter((store) => store._id !== storeId));
    } catch (error) {
      console.error("Error deleting store:", error);
    }
  };

  const handleUpdateStore = (store: Store) => {
    setSelectedStore(store);
    setIsEditModalOpen(true);
  };

  const handleSaveStore = async (storeData: Partial<Store>) => {
    if (selectedStore) {
      try {
        const updatedStore = await updateStore(selectedStore._id, storeData.name || selectedStore.name);
        setStores(stores.map((store) => (store._id === selectedStore._id ? updatedStore : store)));
        setIsEditModalOpen(false);
      } catch (error) {
        console.error("Error updating store:", error);
      }
    }
  };

  const handleViewTables = (storeId: string) => {
    setSelectedTableStoreId(storeId);
    setIsTablesModalOpen(true);
  };

  const handleViewStore = (storeId: string) => {
    setSelectedStoreId(storeId);
    setIsProfileModalOpen(true);
  };

  const handleSearch = async () => {
    setCurrentPage(1);
    // The useEffect will handle the search
  };

  const totalPages = Math.ceil(totalItems / pageSize);

  const getStatusBadgeClass = (isDeleted: boolean) => {
    return isDeleted
      ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
      : "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
  };

  return (
    <AppLayout>
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Store Management</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Manage your stores efficiently</p>
        </div>

        {/* Actions Section */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <button
            onClick={() => navigate("/admin/create-store")}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Create Store</span>
          </button>

          <div className="flex flex-wrap gap-2">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border p-2 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="Search stores..."
              />
              <button
                onClick={handleSearch}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                <Search className="h-5 w-5" />
                <span>Search</span>
              </button>
            </div>

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border p-2 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border p-2 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="createdAt">Created At</option>
                <option value="name">Name</option>
                <option value="status">Status</option>
              </select>

              <select
                value={sortDirection}
                onChange={(e) => setSortDirection(e.target.value)}
                className="border p-2 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-700 border-y border-gray-200 dark:border-gray-600">
                <th className="text-left py-4 px-5 text-lg font-semibold text-gray-900 dark:text-gray-200">#</th>
                <th className="text-left py-4 px-5 text-lg font-semibold text-gray-900 dark:text-gray-200">Name</th>
                <th className="text-left py-4 px-5 text-lg font-semibold text-gray-900 dark:text-gray-200">Status</th>
                <th className="text-left py-4 px-5 text-lg font-semibold text-gray-900 dark:text-gray-200">Address</th>
                <th className="text-left py-4 px-5 text-lg font-semibold text-gray-900 dark:text-gray-200">Manager</th>
                <th className="text-right py-4 px-5 text-lg font-semibold text-gray-900 dark:text-gray-200">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {isLoading ? (
                Array(5).fill(0).map((_, index) => (
                  <tr key={index} className="animate-pulse">
                    <td className="py-4 px-5"><div className="h-6 w-6 bg-gray-200 dark:bg-gray-600 rounded"></div></td>
                    <td className="py-4 px-5"><div className="h-6 w-32 bg-gray-200 dark:bg-gray-600 rounded"></div></td>
                    <td className="py-4 px-5"><div className="h-6 w-24 bg-gray-200 dark:bg-gray-600 rounded"></div></td>
                    <td className="py-4 px-5"><div className="h-6 w-40 bg-gray-200 dark:bg-gray-600 rounded"></div></td>
                    <td className="py-4 px-5"><div className="h-6 w-32 bg-gray-200 dark:bg-gray-600 rounded"></div></td>
                    <td className="py-4 px-5 text-right"><div className="h-6 w-24 bg-gray-200 dark:bg-gray-600 rounded ml-auto"></div></td>
                  </tr>
                ))
              ) : stores.length > 0 ? (
                stores.map((store, index) => (
                  <tr key={store._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="py-4 px-5 text-lg text-gray-600 dark:text-gray-300">
                      {(currentPage - 1) * pageSize + index + 1}
                    </td>
                    <td className="py-4 px-5 text-lg text-gray-900 dark:text-gray-200 font-medium">{store.name}</td>
                    <td className="py-4 px-5">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(store.isDeleted)}`}>
                        {store.isDeleted ? "Inactive" : "Active"}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-lg text-gray-600 dark:text-gray-300">{store.address}</td>
                    <td className="py-4 px-5 text-lg text-gray-600 dark:text-gray-300">{store.manager}</td>
                    <td className="py-4 px-5 text-right space-x-2">
                      <button
                        onClick={() => handleViewStore(store._id)}
                        className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 p-2 rounded-full transition-colors"
                        title="View Store Details"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleViewTables(store._id)}
                        className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 p-2 rounded-full transition-colors"
                        title="View Store Tables"
                      >
                        <Table2 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleUpdateStore(store)}
                        className="text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900 p-2 rounded-full transition-colors"
                        title="Update Store"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteStore(store._id)}
                        className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 p-2 rounded-full transition-colors"
                        title="Delete Store"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 px-5 text-center text-gray-500 dark:text-gray-400">
                    <div className="flex flex-col items-center">
                      <Search className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-3" />
                      <p className="text-lg font-medium">No stores found</p>
                      <p className="text-sm">Try adjusting your search or filter to find what you're looking for.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
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

              {[...Array(totalPages)].map((_, i) => (
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
              ))}

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
      </div>

      {/* Modals */}
      <StoreProfileModal
        storeId={selectedStoreId}
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />

      <EditStoreModal
        isOpen={isEditModalOpen}
        selectedStore={selectedStore}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleSaveStore}
      />

      <StoreTablesModal
        isOpen={isTablesModalOpen}
        onClose={() => setIsTablesModalOpen(false)}
        storeId={selectedTableStoreId}
      />
    </AppLayout>
  );
};

export default StoreManagement;