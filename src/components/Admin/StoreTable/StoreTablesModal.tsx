import React, { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';
import { PoolTable } from '../../../services/Admin/Tables/poolTableService';
import { fetchStorePoolTables } from '../../../services/Admin/Store/storeService';
import { toast } from 'react-toastify';

interface StoreTablesModalProps {
  isOpen: boolean;
  onClose: () => void;
  storeId: string | null;
}

const StoreTablesModal: React.FC<StoreTablesModalProps> = ({ isOpen, onClose, storeId }) => {
  const [tables, setTables] = useState<PoolTable[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const loadTables = async () => {
      if (!storeId) return;

      try {
        setLoading(true);
        setError(null);
        const data = await fetchStorePoolTables(storeId);
        setTables(data || []);
        toast.success("Store tables loaded successfully", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } catch (err) {
        setError('Failed to load tables. Please try again.');
        console.error('Error loading tables:', err);
        setTables([]);
        toast.error("Failed to load store tables", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && storeId) {
      loadTables();
    } else {
      setTables([]);
      setError(null);
      setLoading(true);
    }
  }, [isOpen, storeId]);

  const getStatusBadgeClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case "available":
        return "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300";
      case "ready":
        return "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300";
      case "playing":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300";
      case "finished":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(tables.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTables = tables.slice(startIndex, startIndex + itemsPerPage);

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-5xl w-full rounded-lg bg-white dark:bg-gray-800 p-10">
          <div className="flex justify-between items-center mb-6">
            <Dialog.Title className="text-3xl font-semibold text-gray-900 dark:text-white">
              Store Tables
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-8 w-8" />
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-gray-900 dark:border-white"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-4 text-xl">{error}</div>
          ) : tables.length === 0 ? (
            <div className="text-gray-500 dark:text-gray-400 text-center py-4 text-xl">
              No tables found for this store.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-lg">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {paginatedTables.map((table) => (
                    <tr key={table._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-900 dark:text-gray-300">
                        {table._id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-lg text-gray-900 dark:text-gray-300">
                        {table.tableType?.type_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusBadgeClass(table.status)}`}>
                          {table.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <div className="flex gap-1">
                <button
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center rounded-md p-3 text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
                      currentPage === i + 1 
                        ? "bg-blue-600 text-white" 
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center rounded-md p-3 text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </div>
            </div>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default StoreTablesModal;