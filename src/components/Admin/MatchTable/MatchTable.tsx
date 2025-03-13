import React, { useState, useEffect } from "react";
import {
  fetchMatches,
  createMatch,
  updateMatch,
  deleteMatch,
  fetchMatchById,
  MatchData
} from "../../../services/Admin/Matches/matchesService";
import { Plus, Search } from "lucide-react";
import CreateMatchModal from "./CreateMatchModal";
import EditMatchModal from "./EditMatchModal";
import ViewMatchModal from "./ViewMatchModal";

const MatchTable: React.FC = () => {
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [currentMatchId, setCurrentMatchId] = useState('')
  const [selectedMatch, setSelectedMatch] = useState<MatchData | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false); // State cho View Modal

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const matches = await fetchMatches();
        setMatches(matches);
      } catch (error) {
        console.error("Error fetching matches:", error);
      }
    };

    loadMatches();
  }, []);

  const handleCreateMatch = async (matchData: Partial<MatchData>) => {
    try {
      const newMatch = await createMatch(matchData);
      setMatches([...matches, newMatch]);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating match:", error);
    }
  };

  const handleUpdateMatchStatus = async (matchData: Partial<MatchData>) => {
    if (!currentMatchId) return;
    try {
      const updatedMatch = await updateMatch(currentMatchId, matchData);
      setMatches(matches.map(match => (match._id === updatedMatch._id ? updatedMatch : match)));
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating match status:", error);
    }
  };

  const handleDeleteMatch = async (id: string) => {
    try {
      await deleteMatch(id);
      setMatches(matches.filter(match => match._id !== id));
    } catch (error) {
      console.error("Error deleting match:", error);
    }
  };

  const handleEditMatch = async (id: string) => {
    try {
      setIsEditModalOpen(true);
      setCurrentMatchId(id)
    } catch (error) {
      console.error("Error fetching match:", error);
    }
  };

  const handleViewMatch = async (id: string) => {
    try {
      const match = await fetchMatchById(id);
      console.log("Fetched match for view:", match); // Log để kiểm tra
      setSelectedMatch(match);
      setIsViewModalOpen(true);
    } catch (error) {
      console.error("Error fetching match for view:", error);
    }
  };

  const filteredMatches = matches.filter(match =>
    match.mode_game.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">Match Management</h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">Manage billiard matches efficiently</p>
      </div>
      <div className="flex justify-between mb-4">
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center"
        >
          <Plus className="mr-2" />
          Create Match
        </button>
        <div className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
            placeholder="Search matches..."
          />
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
            <Search />
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-700 border-y border-gray-200 dark:border-gray-600">
              <th className="text-left py-4 px-5 text-lg font-semibold text-gray-800 dark:text-gray-200">Mode Game</th>
              <th className="text-left py-4 px-5 text-lg font-semibold text-gray-800 dark:text-gray-200">Pool Table</th>
              <th className="text-left py-4 px-5 text-lg font-semibold text-gray-800 dark:text-gray-200">Status</th>
              <th className="text-right py-4 px-5 text-lg font-semibold text-gray-800 dark:text-gray-200">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredMatches.map((match) => (
              <tr key={match._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="py-4 px-5 text-gray-900 dark:text-white">{match.mode_game}</td>
                <td className="py-4 px-5 text-gray-900 dark:text-white">{match.pooltable}</td>
                <td className="py-4 px-5 text-gray-900 dark:text-white">{match.status}</td>
                <td className="py-4 px-5 text-right">
                  <button onClick={() => handleViewMatch(match._id)} className="px-4 py-2 text-green-600 hover:text-green-800">View</button>
                  <button onClick={() => handleEditMatch(match._id)} className="px-4 py-2 text-yellow-600 hover:text-yellow-800">Edit</button>
                  <button onClick={() => handleDeleteMatch(match._id)} className="px-4 py-2 text-red-600 hover:text-red-800">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Match Modal */}
      <CreateMatchModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateMatch}
      />

      {/* Edit Match Status Modal */}
      <EditMatchModal
        isOpen={isEditModalOpen}
        matchId={currentMatchId}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleUpdateMatchStatus}
      />

      {/* View Match Modal */}
      <ViewMatchModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        match={selectedMatch}
      />
    </div>
  );
};

export default MatchTable;
