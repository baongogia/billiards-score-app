import React, { useState } from "react";
import { MatchData } from "../../../services/Admin/Matches/matchesService";

interface CreateMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (matchData: Partial<MatchData>) => void;
}

const CreateMatchModal: React.FC<CreateMatchModalProps> = ({ isOpen, onClose, onSave }) => {
  const [matchData, setMatchData] = useState<Partial<MatchData>>({
    status: "ready",
    mode_game: "8-ball",
    pooltable: ""
  });
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMatchData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matchData.pooltable) {
      setError("Pool Table ID is required");
      return;
    }
    setError(null);
    onSave(matchData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-xl font-bold mb-4">Create Match</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
              <select
                name="status"
                value={matchData.status || "ready"}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                required
              >
                <option value="ready">Ready</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="finished">Finished</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mode Game</label>
              <select
                name="mode_game"
                value={matchData.mode_game || "8-ball"}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                required
              >
                <option value="8-ball">8-ball</option>
                <option value="9-ball">9-ball</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Pool Table ID</label>
              <input
                type="text"
                name="pooltable"
                value={matchData.pooltable || ""}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                required
              />
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
              Create Match
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMatchModal;