import React, { useState } from "react";
import { Eye, Edit, Trash2 } from "lucide-react";
import StoreProfileModal from "./StoreProfileModal";
import { toast } from "react-toastify";

interface Store {
  _id: string
  name: string
  status: string
  address: string
  managerID: string
}

interface StoresTableProps {
  stores: Store[]
  onUpdateStore: (storeId: string, newName: string) => void
  onDeleteStore: (storeId: string) => void
}

const StoresTable: React.FC<StoresTableProps> = ({ stores, onUpdateStore, onDeleteStore }) => {
  const [selectedStore, setSelectedStore] = useState<Store | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleViewStore = (store: Store) => {
    try {
      console.log("📌 Viewing store:", store)
      setSelectedStore(store)
      setIsModalOpen(true)
      toast.success("Store details loaded successfully", {
        position: "top-right",
      });
    } catch {
      toast.error("Failed to load store details", {
        position: "top-right",
      });
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedStore(null)
  }

  const handleUpdateStore = async (storeId: string) => {
    try {
      const newName = prompt("Enter new name", selectedStore?.name);
      if (newName) {
        await onUpdateStore(storeId, newName);
        toast.success("Store updated successfully", {
          position: "top-right",
        });
      }
    } catch {
      toast.error("Failed to update store", {
        position: "top-right",
      });
    }
  }

  const handleDeleteStore = async (storeId: string) => {
    if (window.confirm("Are you sure you want to delete this store?")) {
      try {
        await onDeleteStore(storeId);
        toast.success("Store deleted successfully", {
          position: "top-right",
        });
      } catch {
        toast.error("Failed to delete store", {
          position: "top-right",
        });
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {stores.length > 0 ? (
          stores.map((store) => (
            <div key={store._id} className="bg-gray-800 text-white p-4 rounded-lg shadow-md">
              <span className="block font-bold text-lg mb-2">{store.name}</span>
              <span className="block mb-1"><strong>Status:</strong> {store.status}</span>
              <span className="block mb-1 truncate"><strong>Address:</strong> {store.address}</span>
              <span className="block mb-1"><strong>ManagerID:</strong> {store.managerID}</span>
              <div className="flex justify-end mt-4 space-x-2">
                <button
                  onClick={() => handleViewStore(store)}
                  className="text-blue-400 hover:text-blue-300 p-2 hover:bg-gray-700 rounded-full transition-colors"
                  title="View Store"
                >
                  <Eye className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleUpdateStore(store._id)}
                  className="text-yellow-400 hover:text-yellow-300 p-2 hover:bg-gray-700 rounded-full transition-colors"
                  title="Edit Store"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDeleteStore(store._id)}
                  className="text-red-400 hover:text-red-300 p-2 hover:bg-gray-700 rounded-full transition-colors"
                  title="Delete Store"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20 bg-[#111827] rounded-2xl border border-gray-800">
            <p className="text-gray-400 text-lg">No stores found</p>
          </div>
        )}
      </div>
      
      <StoreProfileModal
        storeId={selectedStore?._id || null}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default StoresTable;