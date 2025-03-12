import React, { useState } from "react";
import StoreProfileModal from "./StoreProfileModal";

interface Store {
  _id: string;
  name: string;
  status: string;
  address: string;
  manager: string;
}

interface StoresTableProps {
  stores: Store[];
  onUpdateStore: (storeId: string, newName: string) => void;
  onDeleteStore: (storeId: string) => void;
}

const StoresTable: React.FC<StoresTableProps> = ({ stores, onUpdateStore, onDeleteStore }) => {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleViewStore = (store: Store) => {
    console.log("📌 Viewing store:", store); // Debug log
    setSelectedStore(store);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedStore(null);
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {stores.length > 0 ? (
          stores.map((store) => (
            <div key={store._id} className="bg-gray-800 text-white p-4 rounded-lg shadow-md">
              <span className="block font-bold text-lg mb-2">{store.name}</span>
              <span className="block mb-1"><strong>Status:</strong> {store.status}</span>
              <span className="block mb-1 truncate"><strong>Address:</strong> {store.address}</span>
              <span className="block mb-1"><strong>Manager:</strong> {store.manager}</span>
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => handleViewStore(store)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 mr-2"
                >
                  View Store
                </button>
                <button
                  onClick={() => {
                    const newName = prompt("Enter new name", store.name);
                    if (newName) onUpdateStore(store._id, newName);
                  }}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 mr-2"
                >
                  Update
                </button>
                <button
                  onClick={() => onDeleteStore(store._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-white text-center col-span-full">No stores found</p>
        )}
      </div>

      {/* Store Profile Modal */}
      {selectedStore && (
        <StoreProfileModal
          storeId={selectedStore._id}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default StoresTable;
