import React, { useState } from "react";
import { Eye, Edit, Trash2 } from "lucide-react";
import StoreProfileModal from "./StoreProfileModal";

interface Store {
  _id: string
  name: string
  status: string
  address: string
  manager: string
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
    console.log("📌 Viewing store:", store) // Debug log
    setSelectedStore(store)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedStore(null)
  }

  // const getStatusBadge = (status: string) => {
  //   const statusLower = status.toLowerCase()

  //   const baseClasses = "px-2.5 py-0.5 text-xs font-medium rounded-full"

  //   if (statusLower === "active") {
  //     return `${baseClasses} bg-emerald-900/60 text-emerald-300 border border-emerald-500/30`
  //   } else if (statusLower === "inactive") {
  //     return `${baseClasses} bg-red-900/60 text-red-300 border border-red-500/30`
  //   } else if (statusLower === "pending") {
  //     return `${baseClasses} bg-amber-900/60 text-amber-300 border border-amber-500/30`
  //   } else {
  //     return `${baseClasses} bg-blue-900/60 text-blue-300 border border-blue-500/30`
  //   }
  // }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {stores.length > 0 ? (
          stores.map((store) => (
            <div key={store._id} className="bg-gray-800 text-white p-4 rounded-lg shadow-md">
              <span className="block font-bold text-lg mb-2">{store.name}</span>
              <span className="block mb-1"><strong>Status:</strong> {store.status}</span>
              <span className="block mb-1 truncate"><strong>Address:</strong> {store.address}</span>
              <span className="block mb-1"><strong>Manager:</strong> {store.manager}</span>
              <div className="flex justify-end mt-4 space-x-2">
                <button
                  onClick={() => handleViewStore(store)}
                  className="text-blue-400 hover:text-blue-300 p-2 hover:bg-gray-700 rounded-full transition-colors"
                  title="View Store"
                >
                  <Eye className="h-5 w-5" />
                </button>
                <button
                  onClick={() => {
                    const newName = prompt("Enter new name", store.name);
                    if (newName) onUpdateStore(store._id, newName);
                  }}
                  className="text-yellow-400 hover:text-yellow-300 p-2 hover:bg-gray-700 rounded-full transition-colors"
                  title="Edit Store"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDeleteStore(store._id)}
                  className="text-red-400 hover:text-red-300 p-2 hover:bg-gray-700 rounded-full transition-colors"
                  title="Delete Store"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

              {/* Bottom accent */}
              <div className="h-1 w-full bg-gradient-to-r from-indigo-600 to-purple-600 absolute bottom-0 left-0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-20 bg-[#111827] rounded-2xl border border-gray-800">
            <div className="relative w-24 h-24 mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 flex items-center justify-center text-4xl">📦</div>
            </div>
            <p className="text-white text-xl font-medium mb-2">No stores found</p>
            <p className="text-gray-400 text-sm max-w-xs text-center">
              Your store collection is empty. Add your first store to get started.
            </p>
          </div>
        )}
      </div>

      {/* Store Profile Modal */}
      {selectedStore && (
        <StoreProfileModal storeId={selectedStore._id} isOpen={isModalOpen} onClose={handleCloseModal} />
      )}
    </div>
  )
}

export default StoresTable