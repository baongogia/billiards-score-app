import React, { Fragment, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { MatchData } from '../../../services/Admin/Matches/matchesService';
import { Team, fetchTeamMatch } from '../../../services/Admin/Teams/teamService';

interface ViewMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  match: {match: MatchData} | null;
}

const ViewMatchModal: React.FC<ViewMatchModalProps> = ({ isOpen, onClose, match }) => {
  console.log("Match data:", match);
  
  const [teams, setTeams] = useState<Team[]>([]);

  useEffect(() => {
    const loadTeams = async () => {
      if (match?.match?._id) {
        try {
          const teamsData = await fetchTeamMatch(match.match._id);
          setTeams(teamsData);
          console.log("Teams loaded:", teamsData);
        } catch (error) {
          console.error("Error loading teams:", error);
          setTeams([]);
        }
      }
    };

    loadTeams();
  }, [match]);

  if (!isOpen || !match) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-6 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-4 sm:p-8 shadow-2xl transition-all">
                <Dialog.Title as="h3" className="text-2xl font-bold leading-6 text-gray-900">
                  Match Details
                </Dialog.Title>
                <div className="mt-4">
                  <p className="text-lg text-gray-700">
                    <strong>Match ID:</strong> {match.match._id}
                  </p>
                  <p className="text-lg text-gray-700">
                    <strong>Mode:</strong> {match.match.mode_game}
                  </p>
                  <p className="text-lg text-gray-700">
                    <strong>Table ID:</strong> {match.match.pooltable}
                  </p>
                  <p className="text-lg text-gray-700">
                    <strong>Status:</strong> {match.match.status}
                  </p>
                  <p className="text-lg text-gray-700">
                    <strong>Started:</strong> {new Date(match.match.createdAt).toLocaleString()}
                  </p>
                  {match.match.updatedAt && (
                    <p className="text-lg text-gray-700">
                      <strong>Ended:</strong> {new Date(match.match.updatedAt).toLocaleString()}
                    </p>
                  )}

                  {/* Add Teams Section */}
                  <div className="mt-6">
                    <h4 className="text-xl font-semibold mb-4">Players</h4>
                    {teams.length > 0 ? (
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
                                className={`absolute top-2 right-2 sm:top-4 sm:right-4 transform rotate-12 
                                  px-2 sm:px-4 py-1 sm:py-2 rounded-lg shadow-lg 
                                  ${
                                    isWinner
                                      ? "bg-green-500 text-white border border-green-300"
                                      : "bg-red-500 text-white border border-red-300"
                                  }`}
                              >
                                <span className="text-sm sm:text-xl font-extrabold tracking-wider">
                                  {isWinner ? "WIN" : "LOSE"}
                                </span>
                              </div>

                              <div className="space-y-4 sm:space-y-6">
                                <div className="bg-white p-3 sm:p-4 rounded-lg shadow-inner">
                                  <p className="text-gray-600 text-base sm:text-lg mb-1 sm:mb-2">
                                    Players:
                                  </p>
                                  <p className="font-medium text-lg sm:text-xl capitalize">
                                    {team.members.map(member => member.name).join(", ")}
                                  </p>
                                </div>

                                <div className="bg-white p-3 sm:p-4 rounded-lg shadow-inner">
                                  <p className="text-gray-600 text-base sm:text-lg mb-1 sm:mb-2">
                                    Game Mode:
                                  </p>
                                  <p className="font-medium text-lg sm:text-xl">
                                    {match.match.mode_game}
                                  </p>
                                </div>

                                <div className="grid grid-cols-3 gap-2 sm:gap-6">
                                  <div className="bg-white p-2 sm:p-4 rounded-lg shadow-inner flex flex-col items-center">
                                    <p className="text-gray-600 text-sm sm:text-lg">
                                      Score
                                    </p>
                                    <p className={`font-bold text-xl sm:text-3xl ${
                                      isWinner ? "text-green-600" : "text-red-600"
                                    }`}>
                                      {team.result.score}
                                    </p>
                                  </div>
                                  <div className="bg-white p-2 sm:p-4 rounded-lg shadow-inner flex flex-col items-center">
                                    <p className="text-gray-600 text-sm sm:text-lg">
                                      Fouls
                                    </p>
                                    <p className="font-bold text-lg sm:text-2xl text-gray-800">
                                      {team.result.foulCount}
                                    </p>
                                  </div>
                                  <div className="bg-white p-2 sm:p-4 rounded-lg shadow-inner flex flex-col items-center">
                                    <p className="text-gray-600 text-sm sm:text-lg">
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
                    ) : (
                      <p className="text-lg text-gray-500">No teams found for this match</p>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-6 py-3 text-lg font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={onClose}
                  >
                    Close
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ViewMatchModal;