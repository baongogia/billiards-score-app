import { Search, X } from "lucide-react"
import type { User } from "../../../services/Admin/User/userService"

interface ManagersModalProps {
  isOpen: boolean
  onClose: () => void
  managers: User[]
}

export default function ManagersModal({ isOpen, onClose, managers }: ManagersModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-lg w-full mx-4 overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center p-5 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Managers Without Store</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-5 max-h-[60vh] overflow-y-auto">
          {managers.length > 0 ? (
            <ul className="space-y-3">
              {managers.map((manager) => (
                <li
                  key={manager._id}
                  className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold">
                      {manager.name.charAt(0)}
                    </div>
                    <div className="font-medium text-gray-900 dark:text-white">{manager.name}</div>
                  </div>
                  <div className="grid grid-cols-1 gap-1 text-sm pl-13">
                    <p className="text-gray-600 dark:text-gray-300">
                      <span className="font-medium text-gray-700 dark:text-gray-200">Email:</span>{" "}
                      {manager.email || "N/A"}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300">
                      <span className="font-medium text-gray-700 dark:text-gray-200">ID:</span> {manager._id}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-lg font-medium text-gray-900 dark:text-white">No managers found</p>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                All managers are currently assigned to stores.
              </p>
            </div>
          )}
        </div>
        <div className="p-5 border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}