import React from "react";
import { MatchData } from "../../../services/Admin/Matches/matchesService";

interface EditMatchModalProps {
  isOpen: boolean;
  selectedMatch: MatchData | null;
  onClose: () => void;
  onSave: (matchData: Partial<MatchData>) => void;
}

const EditMatchModal: React.FC<EditMatchModalProps> = ({ isOpen, selectedMatch, onClose, onSave }) => {
  if (!isOpen || !selectedMatch) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">Edit Match Status</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const matchData = {
              status: formData.get("status") as string,
            };
            onSave(matchData);
          }}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
              <select
                name="status"
                defaultValue={selectedMatch.status}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                required
              >
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="finished">Finished</option>
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Update Status
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMatchModal;