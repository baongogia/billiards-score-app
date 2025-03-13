import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchStores, deleteStore, updateStore, searchStore, fetchInactiveStores, Store } from "../../../services/Admin/Store/storeService";
import AppLayout from "../AdminLayout";
import StoreProfileModal from "../../../components/Admin/StoreTable/StoreProfileModal";
import EditStoreModal from "../../../components/Admin/StoreTable/EditStoreModal";

const StoreManagement: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [stores, setStores] = useState<Store[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    const loadStores = async () => {
      try {
        const stores = await fetchStores();
        setStores(stores);
        console.log("Get success");
      } catch (error) {
        console.error("Error fetching stores:", error);
      }
    };

    loadStores();
  }, [location.search]);

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
    navigate(`/table-store/${storeId}`);
  };

  const handleViewStore = (storeId: string) => {
    setSelectedStoreId(storeId);
    setIsProfileModalOpen(true);
  };

  const handleSearch = async () => {
    try {
      const stores = await searchStore({ term: searchTerm });
      setStores(stores);
      console.log("Search success");
    } catch (error) {
      console.error("Error searching store:", error);
    }
  };

  const loadInactiveStores = async () => {
    try {
      const inactiveStores = await fetchInactiveStores();
      console.log("Inactive Stores:", inactiveStores);
      setStores(inactiveStores);
    } catch (error) {
      console.error("Error fetching inactive stores:", error);
    }
  };

  return (
    <AppLayout>
      <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Store Management</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">Manage your stores efficiently</p>
        </div>
        <div className="flex justify-between mb-4">
          <button
            onClick={() => navigate("/admin/create-store")}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Create Store
          </button>
          <div className="flex gap-2">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border p-2 rounded-lg"
              placeholder="Search by ID or Name"
            />
            <button
              onClick={handleSearch}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
            >
              Search
            </button>
            <button
              onClick={loadInactiveStores}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <span>Find Inactive Stores</span>
            </button>
          </div>
        </div>
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
              {stores.map((store, index) => (
                <tr key={store._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="py-4 px-5 text-lg text-gray-600 dark:text-gray-300">{index + 1}</td>
                  <td className="py-4 px-5 text-lg text-gray-900 dark:text-gray-200 font-medium">{store.name}</td>
                  <td className="py-4 px-5 text-lg text-gray-600 dark:text-gray-300">{store.status}</td>
                  <td className="py-4 px-5 text-lg text-gray-600 dark:text-gray-300">{store.address}</td>
                  <td className="py-4 px-5 text-lg text-gray-600 dark:text-gray-300">{store.manager}</td>
                  <td className="py-4 px-5 text-right space-x-2">
                    <button
                      onClick={() => handleViewStore(store._id)}
                      className="px-4 py-2 text-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-md transition-colors"
                    >
                      View Store
                    </button>
                    <button
                      onClick={() => handleViewTables(store._id)}
                      className="px-4 py-2 text-lg text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-md transition-colors"
                    >
                      View Tables
                    </button>
                    <button
                      onClick={() => handleUpdateStore(store)}
                      className="px-4 py-2 text-lg text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900 rounded-md transition-colors"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDeleteStore(store._id)}
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
      </div>

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
    </AppLayout>
  );
};

export default StoreManagement;