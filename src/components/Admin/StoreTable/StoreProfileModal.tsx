import React, { useEffect, useState } from "react";
import { fetchStoreById, Store } from "../../../services/Admin/Store/storeService";

interface StoreProfileModalProps {
  storeId: string | null;
  isOpen: boolean;
  onClose: () => void;
}

const StoreProfileModal: React.FC<StoreProfileModalProps> = ({ storeId, isOpen, onClose }) => {
  const [store, setStore] = useState<Store | null>(null);

  useEffect(() => {
    const loadStore = async () => {
      if (storeId) {
        try {
          const fetchedStore = await fetchStoreById(storeId);
          console.log("Fetched Store:", fetchedStore); // Debugging log
          setStore(fetchedStore);
        } catch (error) {
          console.error("Error fetching store by ID:", error);
        }
      }
    };

    loadStore();
  }, [storeId]);

  if (!isOpen || !store) return null;

  console.log("Store Data:", store); // Debugging log

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{store.name}</h2>

        <div className="space-y-2 text-gray-700 dark:text-gray-300">
          <p><strong>ID:</strong> {store._id}</p>
          <p><strong>Status:</strong> {store.isDeleted ? "Inactive" : "Active"}</p>
          <p><strong>Address:</strong> {store.address}</p>
          <p><strong>Manager:</strong> {store.manager}</p>
        </div>

        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default StoreProfileModal;