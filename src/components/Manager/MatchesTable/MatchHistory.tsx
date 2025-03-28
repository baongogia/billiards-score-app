import { useState, useEffect } from "react";
import { MatchData, fetchMatches, fetchMatchById, updateMatch } from "../../../services/Admin/Matches/matchesService";
import { fetchStores } from "../../../services/Admin/Store/storeService";
import { fetchPoolTablesByStoreId } from "../../../services/Admin/Tables/poolTableService";
import { useAuth } from "../../../context/AuthContext";
import EditMatchModal from "../../Admin/MatchTable/EditMatchModal";
import ViewMatchModal from "../../Admin/MatchTable/ViewMatchModal";
import { toast } from "react-toastify";

const MatchHistory = () => {
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [selectedMatch, setSelectedMatch] = useState<{ match: MatchData } | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const loadMatches = async () => {
      try {
        if (!user) return;

        // Fetch the manager's store
        const storesData = await fetchStores();
        const managerStore = storesData.find((store) => store.manager === user._id);

        if (managerStore) {
          // Fetch pool tables for the store
          const storeTablesResponse = await fetchPoolTablesByStoreId(managerStore._id);
          const storeTables = storeTablesResponse.tables;

          if (Array.isArray(storeTables)) {
            // Fetch all matches
            const allMatches = await fetchMatches();

            // Filter matches belonging to the store's tables
            const storeMatches = allMatches.filter((match) =>
              storeTables.some((table) => table._id === match.pooltable)
            );

            setMatches(storeMatches);
          } else {
            toast.error("Failed to load tables data", { position: "top-right" });
          }
        } else {
          toast.error("No matches found in store", { position: "top-right" });
        }
      } catch (error) {
        console.error("Error loading matches:", error);
        toast.error("Failed to load match history", { position: "top-right" });
      }
    };

    loadMatches();
  }, [user]);

  const handleEditMatch = async (id: string) => {
    try {
      const match = await fetchMatchById(id);
      setSelectedMatch(match);
      setIsEditModalOpen(true);
      toast.success("Match loaded for editing", { position: "top-right" });
    } catch (error) {
      console.error("Error fetching match:", error);
      toast.error("Failed to load match for editing", { position: "top-right" });
    }
  };

  const handleViewMatch = async (id: string) => {
    try {
      const match = await fetchMatchById(id);
      setSelectedMatch(match);
      setIsViewModalOpen(true);
      toast.success("Match details loaded successfully", { position: "top-right" });
    } catch (error) {
      console.error("Error fetching match for view:", error);
      toast.error("Failed to load match details", { position: "top-right" });
    }
  };

  const handleEditSubmit = async (matchData: Partial<MatchData>) => {
    if (!selectedMatch) return;
    try {
      const updatedMatch = await updateMatch(selectedMatch.match._id, matchData);
      setMatches((prevMatches) =>
        prevMatches.map((match) =>
          match._id === updatedMatch._id ? updatedMatch : match
        )
      );
      setIsEditModalOpen(false);
      toast.success("Match updated successfully", { position: "top-right" });
    } catch (error) {
      console.error("Error updating match status:", error);
      toast.error("Failed to update match", { position: "top-right" });
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Match History</h2>
      <div className="space-y-4">
        {matches.map((match) => (
          <div key={match._id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-lg">Match ID: {match._id}</p>
                <p className="text-sm text-gray-500">Mode: {match.mode_game}</p>
                <p className="text-sm text-gray-500">Table ID: {match.pooltable}</p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  match.status === "pending"
                    ? "bg-yellow-100 text-yellow-800"
                    : match.status === "playing"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {match.status}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditMatch(match._id)}
                  className="ml-4 px-4 py-2 bg-teal-600 text-white rounded-md shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleViewMatch(match._id)}
                  className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  View
                </button>
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              <p>Started: {new Date(match.createdAt).toLocaleString()}</p>
              {match.endAt && <p>Ended: {new Date(match.endAt).toLocaleString()}</p>}
            </div>
          </div>
        ))}
      </div>

      {selectedMatch && (
        <EditMatchModal
          isOpen={isEditModalOpen}
          selectedMatch={selectedMatch.match}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleEditSubmit}
        />
      )}

      {selectedMatch && (
        <ViewMatchModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          match={selectedMatch}
        />
      )}
    </div>
  );
};

export default MatchHistory;