import React, { useState, useEffect } from "react";
import {
  fetchMatches,
  createMatch,
  updateMatch,
  deleteMatch,
  fetchMatchById,
  MatchData,
} from "../../../services/Admin/Matches/matchesService";
import { Plus, Search, ChevronLeft, ChevronRight, Edit, Trash2, Eye } from "lucide-react";
import CreateMatchModal from "./CreateMatchModal";
import EditMatchModal from "./EditMatchModal";
import ViewMatchModal from "./ViewMatchModal";

const MatchTable: React.FC = () => {
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<MatchData | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Add status badge styling function
  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400";
      case "playing":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "finished":
        return "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-300 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  // Debug state changes for isEditModalOpen
  useEffect(() => {
    console.log("isEditModalOpen changed to:", isEditModalOpen);
  }, [isEditModalOpen]);

  // Load matches on component mount
  useEffect(() => {
    const loadMatches = async () => {
      try {
        const matchesData = await fetchMatches();
        setMatches(matchesData);
      } catch (error) {
        console.error("Error fetching matches:", error);
      }
    };

    loadMatches();
  }, []);

  // Handle creating a new match
  const handleCreateMatch = async (matchData: Partial<MatchData>) => {
    try {
      const newMatch = await createMatch(
        matchData.status || 'pending',
        matchData.mode_game || '',
        matchData.pooltable || ''
      );
      setMatches((prevMatches) => [...prevMatches, newMatch]);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Error creating match:", error);
    }
  };

  // Handle updating an existing match
  const handleUpdateMatchStatus = async (matchData: Partial<MatchData>) => {
    if (!selectedMatch) return;
    try {
      const updatedMatch = await updateMatch(selectedMatch._id, matchData);
      setMatches((prevMatches) =>
        prevMatches.map((match) =>
          match._id === updatedMatch._id ? updatedMatch : match
        )
      );
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating match status:", error);
    }
  };

  // Handle deleting a match
  const handleDeleteMatch = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this match?")) {
      try {
        await deleteMatch(id);
        setMatches((prevMatches) => prevMatches.filter((match) => match._id !== id));
      } catch (error) {
        console.error("Error deleting match:", error);
      }
    }
  };

  // Handle opening the edit modal for a match
  const handleEditMatch = async (id: string) => {
    try {
      const match = await fetchMatchById(id);
      console.log("Fetched match data:", match);
      setSelectedMatch(match);
      setIsEditModalOpen(true);
    } catch (error) {
      console.error("Error fetching match:", error);
    }
  };

  // Handle viewing match details
  const handleViewMatch = async (id: string) => {
    try {
      const match = await fetchMatchById(id);
      console.log("Fetched match for view:", match);
      setSelectedMatch(match);
      setIsViewModalOpen(true);
    } catch (error) {
      console.error("Error fetching match for view:", error);
    }
  };

  // Filter matches based on search term
  const filteredMatches = matches.filter((match) =>
    match.mode_game.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalPages = Math.ceil(filteredMatches.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedMatches = filteredMatches.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      {/* Header Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
          Match Management
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Manage billiard matches efficiently
        </p>
      </div>

      {/* Actions Section (Create Button and Search Bar) */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
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

      {/* Matches Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Mode Game
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Pool Table
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {paginatedMatches.map((match) => (
              <tr key={match._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  {match.mode_game}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                  {match.pooltable}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(match.status)}`}>
                    {match.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleViewMatch(match._id)}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleEditMatch(match._id)}
                    className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300 mr-4"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteMatch(match._id)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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

      {/* Modals */}
      <CreateMatchModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSave={handleCreateMatch}
      />

      <EditMatchModal
        isOpen={isEditModalOpen}
        selectedMatch={selectedMatch}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleUpdateMatchStatus}
      />

      <ViewMatchModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        match={selectedMatch}
      />
    </div>
  );
};

export default MatchTable;