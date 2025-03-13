// EditMatchModal.tsx
import { useState, useEffect } from "react";
import { PoolTable, PoolTableRequest, updatePoolTable, createPoolTable } from "../../../services/Admin/Tables/poolTableService";
import { X } from "lucide-react";

interface EditMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  table?: PoolTable | null;
  onSuccess: () => void;
}

export default function EditMatchModal({ isOpen, onClose, table, onSuccess }: EditMatchModalProps) {
  const [formData, setFormData] = useState<PoolTableRequest>({
    status: "available",
    tableType: {
      type_name: "",
      compatible_mode: []
    },
    store: ""
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (table) {
      setFormData({
        status: table.status,
        tableType: {
          type_name: table.tableType.type_name,
          compatible_mode: table.tableType.compatible_mode
        },
        store: table.store
      });
    }
  }, [table]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (table) {
        // Update existing table
        await updatePoolTable(table._id, formData);
      } else {
        // Create new table
        await createPoolTable(formData);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving table:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            {table ? "Edit Table" : "Create New Table"}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as "available" | "occupied" | "maintenance" })}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Table Type Name
              </label>
              <input
                type="text"
                value={formData.tableType.type_name}
                onChange={(e) => setFormData({
                  ...formData,
                  tableType: { ...formData.tableType, type_name: e.target.value }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Compatible Modes (comma separated)
              </label>
              <input
                type="text"
                value={formData.tableType.compatible_mode.join(", ")}
                onChange={(e) => setFormData({
                  ...formData,
                  tableType: {
                    ...formData.tableType,
                    compatible_mode: e.target.value.split(",").map(mode => mode.trim())
                  }
                })}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Store
              </label>
              <input
                type="text"
                value={formData.store}
                onChange={(e) => setFormData({ ...formData, store: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
            >
              {loading ? "Saving..." : table ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}