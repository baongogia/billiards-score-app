import { useState, useEffect } from 'react';
import { MatchData, fetchMatches } from '../../../services/Admin/Matches/matchesService';
import { fetchStores } from '../../../services/Admin/Store/storeService';
import { fetchPoolTablesByStoreId } from '../../../services/Admin/Tables/poolTableService';
import { useAuth } from '../../../context/AuthContext';
import EditMatchModal from '../../Admin/MatchTable/EditMatchModal';
import ViewMatchModal from '../../Admin/MatchTable/ViewMatchModal';
import { toast } from "react-toastify";

const MatchHistory = () => {
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<MatchData | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const loadMatches = async () => {
      try {
        if (!user) return;

        // Tìm store của manager
        const storesData = await fetchStores();
        const managerStore = storesData.find(store => store.manager === user._id);

        if (managerStore) {
          // Lấy danh sách bàn của store
          const storeTablesResponse = await fetchPoolTablesByStoreId(managerStore._id);
          const storeTables = storeTablesResponse.tables;
          console.log("Fetched store tables:", storeTables);

          if (Array.isArray(storeTables)) {
            // Lấy tất cả matches
            const allMatches = await fetchMatches();
            console.log("Fetched all matches:", allMatches);

            // Lọc matches thuộc các bàn của store
            const storeMatches = allMatches.filter(match =>
              storeTables.some(table => table._id === match.pooltable)
            );

            setMatches(storeMatches);
            console.log("Filtered store matches:", storeMatches);
          } else {
            setError("Failed to load tables");
            toast.error("Failed to load tables data", {
              position: "top-right",
            });
          }
        } else {
          setError("No matches in store");
          toast.error("No matches found in store", {
            position: "top-right",
          });
        }
      } catch (error) {
        console.error("Error loading matches:", error);
        setError("Failed to load matches");
        toast.error("Failed to load match history", {
          position: "top-right",
        });
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, [user]);

  const handleEditClick = (match: MatchData) => {
    setSelectedMatch(match);
    setIsEditModalOpen(true);
  };

  const handleViewClick = (match: MatchData) => {
    try {
      if (match) {
        setSelectedMatch(match);
        setIsViewModalOpen(true);
        toast.success("Match details loaded successfully", {
          position: "top-right",
        });
      }
    } catch (error) {
      console.error("Error viewing match:", error);
      toast.error("Failed to load match details", {
        position: "top-right",
      });
    }
  };

  // Update handleEditSubmit function
  const handleEditSubmit = (matchData: Partial<MatchData>) => {
    try {
      // Handle updating the match here
      console.log("Updated match data:", matchData);
      setIsEditModalOpen(false);
      toast.success("Match updated successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
    } catch (error) {
      console.error("Error updating match:", error);
      toast.error("Failed to update match", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
      });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Match History</h2>
      <div className="space-y-4">
        {matches.map((match) => (
          <div key={match._id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Match ID: {match._id}</p>
                <p className="text-sm text-gray-500">Mode: {match.mode_game}</p>
                <p className="text-sm text-gray-500">Table ID: {match.pooltable}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                match.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                match.status === 'playing' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {match.status}
              </span>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEditClick(match)}
                  className="ml-4 px-4 py-2 bg-teal-600 text-white rounded-md shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleViewClick(match)}
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
          selectedMatch={selectedMatch}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleEditSubmit}
        />
      )}

      // Update the ViewMatchModal render section
      {isViewModalOpen && selectedMatch && (
        <ViewMatchModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedMatch(null);
          }}
          match={selectedMatch}
        />
      )}
    </div>
  );
};

export default MatchHistory;