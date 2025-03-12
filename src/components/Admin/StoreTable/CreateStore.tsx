import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createStore, Store } from "../../../services/Admin/Store/storeService";

const CreateStore: React.FC = () => {
  const navigate = useNavigate();
  const [newStoreName, setNewStoreName] = useState("");
  const [newStoreAddress, setNewStoreAddress] = useState("");
  const [newStoreManager, setNewStoreManager] = useState("");

  const [storeData, setStoreData] = useState<Store | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateStore = async () => {
    if (newStoreName.trim() && newStoreAddress.trim() && newStoreManager.trim()) {
      setIsSubmitting(true);
      try {
        const store = await createStore(newStoreName, newStoreAddress, newStoreManager);
        setStoreData(store);
        console.log("Store created successfully:", store);
      } catch (error) {
        console.error("Error creating store:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl transform transition-all duration-300">
        <h2 className="text-3xl font-extrabold text-center text-gray-800 dark:text-white mb-8">
          Create New Store
        </h2>

        <div className="space-y-6">
          <label className="block">
            <span className="text-gray-700 dark:text-gray-300 font-semibold">Store Name</span>
            <input
              type="text"
              value={newStoreName}
              onChange={(e) => setNewStoreName(e.target.value)}
              className="mt-2 block w-full h-12 px-4 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white transition duration-200 ease-in-out"
              placeholder="Enter store name"
            />
          </label>

          <label className="block">
            <span className="text-gray-700 dark:text-gray-300 font-semibold">Store Address</span>
            <input
              type="text"
              value={newStoreAddress}
              onChange={(e) => setNewStoreAddress(e.target.value)}
              className="mt-2 block w-full h-12 px-4 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white transition duration-200 ease-in-out"
              placeholder="Enter store address"
            />
          </label>

          <label className="block">
            <span className="text-gray-700 dark:text-gray-300 font-semibold">Store Manager ID</span>
            <input
              type="text"
              value={newStoreManager}
              onChange={(e) => setNewStoreManager(e.target.value)}
              className="mt-2 block w-full h-12 px-4 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:text-white transition duration-200 ease-in-out"
              placeholder="Enter store manager ID"
            />
          </label>

          <div className="flex justify-between">
            <button
              onClick={handleCreateStore}
              disabled={isSubmitting}
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating...
                </span>
              ) : (
                "Create Store"
              )}
            </button>
            <button
              onClick={() => navigate("/admin/stores")}
              className="ml-4 w-full h-12 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
            >
              Back to Stores
            </button>
          </div>
        </div>

        {storeData && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 transition-opacity duration-300">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all duration-300 scale-100">
              <div className="flex justify-center mb-6">
                <div className="rounded-full bg-green-100 p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
                Store Created Successfully
              </h3>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-5 mb-6 shadow-inner">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-gray-500 dark:text-gray-400 font-medium">Name:</div>
                  <div className="text-gray-900 dark:text-white font-semibold text-right">{storeData.name}</div>

                  <div className="text-gray-500 dark:text-gray-400 font-medium">Address:</div>
                  <div className="text-gray-900 dark:text-white font-semibold text-right">{storeData.address}</div>

                  <div className="text-gray-500 dark:text-gray-400 font-medium">Manager ID:</div>
                  <div className="text-gray-900 dark:text-white font-semibold text-right">{storeData.manager}</div>

                  <div className="text-gray-500 dark:text-gray-400 font-medium">Store ID:</div>
                  <div className="text-gray-900 dark:text-white font-semibold text-right">{storeData._id}</div>
                </div>
              </div>

              <button
                onClick={() => navigate("/admin/stores")}
                className="w-full h-12 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateStore;