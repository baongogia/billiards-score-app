import { X } from "lucide-react"

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmationModal({ isOpen, onClose, onConfirm }: DeleteConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="p-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Confirm Deletion</h2>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <X className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-gray-700 dark:text-gray-300">
                Are you sure you want to delete this user? This action cannot be undone.
              </p>
            </div>
          </div>
        </div>
        <div className="p-5 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}