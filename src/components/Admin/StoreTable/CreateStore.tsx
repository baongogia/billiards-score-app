import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createStore, Store } from "../../../services/Admin/Store/storeService";

const CreateStore: React.FC = () => {
  const navigate = useNavigate();
  const [formName, setFormName] = useState("");
  const [formLocation, setFormLocation] = useState("");
  const [formSupervisor, setFormSupervisor] = useState("");
  const [createdStore, setCreatedStore] = useState<Store | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent the default form submission behavior

    if (formName.trim() && formLocation.trim() && formSupervisor.trim()) {
      setIsProcessing(true);
      try {
        const newStore = await createStore(formName, formLocation, formSupervisor);
        setCreatedStore(newStore);
        console.log("Form submitted successfully:", newStore);
      } catch (error) {
        console.error("Error submitting form:", error);
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <div className="flex justify-center items-center w-full min-h-screen bg-[#111111]">
      <div className="w-full max-w-md bg-[#394264] p-8 rounded-xl shadow-2xl">
        <h2 className="text-3xl font-bold text-center text-white mb-4">
          Create New Store
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Store Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full p-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Store name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formLocation}
              onChange={(e) => setFormLocation(e.target.value)}
              className="w-full p-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Store location"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Manager ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formSupervisor}
              onChange={(e) => setFormSupervisor(e.target.value)}
              className="w-full p-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              placeholder="Manager ID"
              required
            />
          </div>

          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/admin/stores")}
              className="px-4 py-2 text-teal-700 bg-[#394264] rounded-md shadow-sm hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="px-4 py-2 text-white bg-teal-600 rounded-md shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {isProcessing ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>

        {createdStore && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 p-2 rounded-full">
                  <svg
                    className="h-6 w-6 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              </div>

              <h2 className="text-xl font-semibold text-center mb-4">
                Submission Successful
              </h2>

              <div className="bg-gray-50 p-4 rounded-md space-y-2">
                <p>
                  <span className="font-medium">Name:</span> {createdStore.name}
                </p>
                <p>
                  <span className="font-medium">Location:</span>{" "}
                  {createdStore.address}
                </p>
                <p>
                  <span className="font-medium">ManagerID:</span>{" "}
                  {createdStore.manager}
                </p>
                <p>
                  <span className="font-medium">ID:</span> {createdStore._id}
                </p>
              </div>

              <button
                onClick={() => navigate("/admin/stores")}
                className="w-full mt-4 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateStore;