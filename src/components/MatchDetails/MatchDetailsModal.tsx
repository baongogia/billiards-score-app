import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { Team, fetchTeamMatch } from "../../services/Admin/Teams/teamService";

interface MatchDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  matchId: string;
}

const MatchDetailsModal = ({ isOpen, onClose, matchId }: MatchDetailsModalProps) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTeams = async () => {
      try {
        const data = await fetchTeamMatch(matchId);
        setTeams(data);
      } catch (error) {
        console.error("Failed to load match details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && matchId) {
      loadTeams();
    }
  }, [isOpen, matchId]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <div className="fixed inset-0 bg-black bg-opacity-50" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-2 sm:p-4">
            <Dialog.Panel className="w-full max-w-5xl transform overflow-hidden rounded-2xl bg-white p-4 sm:p-8 shadow-2xl transition-all">
              <Dialog.Title className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Match Details
              </Dialog.Title>

              {loading ? (
                <div className="text-center py-4 sm:py-8">
                  <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-4 border-blue-600 mx-auto"></div>
                  <p className="text-lg sm:text-xl mt-4">Loading match details...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-10">
                  {teams.map((team) => {
                    const isWinner = team.result.score === Math.max(...teams.map(t => t.result.score));
                    return (
                      <div
                        key={team._id}
                        className={`relative p-4 sm:p-8 rounded-xl shadow-lg transition-all duration-300 overflow-hidden
                          ${
                            isWinner
                              ? "bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-500"
                              : "bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-500"
                          }`}
                      >
                        {/* Win/Lose Badge */}
                        <div
                          className={`absolute top-3 right-3 sm:top-6 sm:right-6 transform rotate-12 
                            px-4 sm:px-8 py-2 sm:py-3 rounded-xl shadow-lg 
                          ${
                            isWinner
                              ? "bg-green-500 text-white border-2 border-green-300"
                              : "bg-red-500 text-white border-2 border-red-300"
                          }`}
                        >
                          <span className="text-xl sm:text-4xl font-extrabold tracking-wider">
                            {isWinner ? "WIN" : "LOSE"}
                          </span>
                        </div>

                        <h3 className="text-xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800 pr-20">
                          {team.teamName}
                        </h3>

                        <div className="space-y-4 sm:space-y-6">
                          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-inner">
                            <p className="text-gray-600 text-base sm:text-lg mb-1 sm:mb-2">
                              Players:
                            </p>
                            <p className="font-medium text-lg sm:text-xl capitalize">
                              {team.members
                                .map((member) => member.name)
                                .join(", ")}
                            </p>
                          </div>

                          <div className="bg-white p-3 sm:p-4 rounded-lg shadow-inner">
                            <p className="text-gray-600 text-base sm:text-lg mb-1 sm:mb-2">
                              Game Mode:
                            </p>
                            <p className="font-medium text-lg sm:text-xl">
                              {team.match.mode_game}
                            </p>
                          </div>

                          <div className="grid grid-cols-3 gap-2 sm:gap-6">
                            <div className="bg-white p-2 sm:p-4 rounded-lg shadow-inner text-center">
                              <p className="text-gray-600 text-sm sm:text-lg mb-1 sm:mb-2">
                                Score
                              </p>
                              <p
                                className={`font-bold text-xl sm:text-3xl ${
                                  isWinner ? "text-green-600" : "text-red-600"
                                }`}
                              >
                                {team.result.score}
                              </p>
                            </div>
                            <div className="bg-white p-2 sm:p-4 rounded-lg shadow-inner text-center">
                              <p className="text-gray-600 text-sm sm:text-lg mb-1 sm:mb-2">
                                Fouls
                              </p>
                              <p className="font-bold text-lg sm:text-2xl text-gray-800">
                                {team.result.foulCount}
                              </p>
                            </div>
                            <div className="bg-white p-2 sm:p-4 rounded-lg shadow-inner text-center">
                              <p className="text-gray-600 text-sm sm:text-lg mb-1 sm:mb-2">
                                Strokes
                              </p>
                              <p className="font-bold text-lg sm:text-2xl text-gray-800">
                                {team.result.strokes}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="mt-6 sm:mt-10 text-center">
                <button
                  onClick={onClose}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 sm:px-8 py-2 sm:py-3 text-base sm:text-lg rounded-lg
                    hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200
                    font-semibold shadow-lg w-full sm:w-auto"
                >
                  Close
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default MatchDetailsModal;