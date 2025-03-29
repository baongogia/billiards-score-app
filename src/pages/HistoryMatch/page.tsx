import { useCallback, useEffect, useState } from "react";
import {
  Team,
  fetchUserMatchHistory,
} from "../../services/Admin/Teams/teamService";
import { format } from "date-fns";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { IoMdArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import MatchDetailsModal from "../../components/MatchDetails/MatchDetailsModal";
import "./index.scss";

export default function HistoryMatch() {
  const [matches, setMatches] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatchId, setSelectedMatchId] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { userId } = useParams();
  const navigate = useNavigate();

  const fetchHistory = useCallback(async () => {
    try {
      if (!userId) throw new Error("User ID is required");
      const data = await fetchUserMatchHistory(userId);
      setMatches(data);
    } catch (error) {
      toast.error("Failed to load match history");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleViewMatch = (matchId: string) => {
    setSelectedMatchId(matchId);
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="history-wrapper">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="history-wrapper p-3 sm:p-6">
      <div className="history-header flex items-center justify-between mb-4 sm:mb-8">
        <button
          onClick={() => navigate(-1)}
          className="back-button flex items-center text-base sm:text-lg hover:text-blue-600 transition-colors"
        >
          <IoMdArrowRoundBack className="w-5 h-5 sm:w-6 sm:h-6 mr-1 sm:mr-2" />
          Back
        </button>
        <h1 className="history-title text-xl sm:text-3xl font-bold">
          Match History
        </h1>
        <div className="w-10 sm:w-20"></div> {/* Spacer for centering */}
      </div>

      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full min-w-[640px]">
          <thead className="bg-red-200">
            <tr>
              <th className="p-3 sm:p-4 text-left text-sm sm:text-base font-semibold">
                Game Mode
              </th>
              <th className="p-3 sm:p-4 text-left text-sm sm:text-base font-semibold">
                Date
              </th>
              <th className="p-3 sm:p-4 text-center text-sm sm:text-base font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {matches.map((match) => (
              <tr key={match._id} className="border-t bg-gray-50">
                <td className="p-3 sm:p-4 text-sm sm:text-base">
                  {match.match.mode_game}
                </td>{" "}
                {/* Corrected this line */}
                <td className="p-3 sm:p-4 text-sm sm:text-base whitespace-nowrap">
                  {format(new Date(match.createdAt), "PPp")}
                </td>
                <td className="p-3 sm:p-4 text-center">
                  <button
                    onClick={() => handleViewMatch(match._id)}
                    className="bg-blue-500 text-white px-3 sm:px-4 py-1.5 sm:py-2 
            rounded text-sm sm:text-base hover:bg-blue-600 transition-colors
            min-w-[100px]"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <MatchDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        matchId={selectedMatchId}
      />
    </div>
  );
}
