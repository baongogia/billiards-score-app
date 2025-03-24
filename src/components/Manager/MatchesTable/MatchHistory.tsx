import React, { useState, useEffect } from 'react';
import { MatchData, fetchMatches } from '../../../services/Admin/Matches/matchesService';
import { Store, fetchStores } from '../../../services/Admin/Store/storeService';
import { PoolTable, fetchPoolTablesByStoreId } from '../../../services/Admin/Tables/poolTableService';
import { useAuth } from '../../../context/AuthContext';

const MatchHistory = () => {
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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
          const storeTables = await fetchPoolTablesByStoreId(managerStore._id);
          
          // Lấy tất cả matches
          const allMatches = await fetchMatches();
          
          // Lọc matches thuộc các bàn của store
          const storeMatches = allMatches.filter(match => 
            storeTables.some(table => table._id === match.pooltable)
          );
          
          setMatches(storeMatches);
        } else {
          setError("No store found for this manager.");
        }
      } catch (error) {
        console.error("Error loading matches:", error);
        setError("Failed to load matches");
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, [user]);

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
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                match.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                match.status === 'playing' ? 'bg-blue-100 text-blue-800' :
                'bg-green-100 text-green-800'
              }`}>
                {match.status}
              </span>
            </div>
            <div className="mt-2 text-sm text-gray-600">
              <p>Started: {new Date(match.createdAt).toLocaleString()}</p>
              {match.endAt && <p>Ended: {new Date(match.endAt).toLocaleString()}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MatchHistory;