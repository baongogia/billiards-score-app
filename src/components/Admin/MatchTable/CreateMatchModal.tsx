import React from "react";
import { MatchData } from "../../../services/Admin/Matches/matchesService";

interface CreateMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (matchData: Partial<MatchData>) => void;
}

const CreateMatchModal: React.FC<CreateMatchModalProps> = ({ isOpen, onClose, onSave }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-[#394264] p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-3xl font-bold text-center text-white mb-4">Create Match</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target as HTMLFormElement);
            const matchData = Object.fromEntries(formData.entries()) as Partial<MatchData>;
            onSave(matchData);
          }}
          className="space-y-6"
        >
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              className="w-full p-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              required
            >
              <option value="">Select status...</option>
              <option value="ready">Ready</option>
              <option value="playing">Playing</option>
              <option value="finished">Finished</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Mode Game <span className="text-red-500">*</span>
            </label>
            <select
              name="mode_game"
              className="w-full p-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              required
            >
              <option value="">Select mode...</option>
              <option value="8-ball">8 Ball</option>
              <option value="9-ball">9 Ball</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Pool Table <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="pooltable"
              placeholder="Enter pool table ID"
              className="w-full p-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              required
            />
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
              Create Match
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMatchModal;