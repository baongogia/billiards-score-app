import React, { useState, useEffect } from "react";
import { Store } from "../../../services/Admin/Store/storeService";
import toast from "react-hot-toast";

interface EditStoreModalProps {
  isOpen: boolean;
  selectedStore: Store | null;
  onClose: () => void;
  onSave: (storeData: Partial<Store>) => void;
}

const EditStoreModal: React.FC<EditStoreModalProps> = ({ isOpen, selectedStore, onClose, onSave }) => {
  const [storeData, setStoreData] = useState<Partial<Store>>({});

  useEffect(() => {
    if (selectedStore) {
      console.log("Selected Store:", selectedStore);
      setStoreData(selectedStore);
    }
  }, [selectedStore]);

  if (!isOpen || !selectedStore) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "status") {
      setStoreData((prevData) => ({
        ...prevData,
        isDeleted: value === "inactive",
      }));
    } else {
      setStoreData((prevData) => ({ ...prevData, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log("Store Data to Save:", storeData);
      onSave(storeData);
      toast.success("Store updated successfully", {
        position: "top-right",
      });
    } catch (error) {
      console.error("Error updating store:", error);
      toast.error("Failed to update store", {
        position: "top-right",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center #111111">
      <div className="bg-[#394264] p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-3xl font-bold text-center text-white mb-4">Edit Store</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={storeData.name || ""}
              onChange={handleChange}
              className="w-full p-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="address"
              value={storeData.address || ""}
              onChange={handleChange}
              className="w-full p-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Manager ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="manager"
              value={storeData.manager || ""}
              onChange={handleChange}
              className="w-full p-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              value={storeData.isDeleted ? "inactive" : "active"}
              onChange={handleChange}
              className="w-full p-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              required
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-teal-700 bg-[#394264] rounded-md shadow-sm hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-teal-600 rounded-md shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStoreModal;