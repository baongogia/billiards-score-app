import React, { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { fetchMatches, MatchData } from "../../../services/Manager/Matches/matchesService";

export default function MatchHistory() {
  const [matches, setMatches] = useState<MatchData[]>([]);

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

  return (
    <div className="min-h-screen bg-black bg-opacity-80 text-white">
      {/* Background image with overlay */}
      <div
        className="absolute inset-0 -z-10 bg-cover bg-center opacity-30"
        style={{ backgroundImage: "url('/placeholder.svg?height=800&width=600')" }}
      />

      {/* Header */}
      <div className="p-4 flex items-center">
        <button className="p-2">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-center flex-1 text-3xl font-bold tracking-wider">MATCH HISTORY</h1>
      </div>

      {/* Recent Games Section */}
      <div className="px-4 pb-6">
        <div className="bg-white bg-opacity-10 rounded-lg overflow-hidden">
          <div className="bg-[#5d2e2e] py-3 px-4 text-center font-medium text-2xl">RECENT GAMES</div>

          {/* Table Header */}
          <div className="grid grid-cols-5 text-lg font-medium py-2 px-3 border-b border-gray-700">
            <div>Mode Game</div>
            <div className="text-center">Pool Table</div>
            <div className="text-center">Status</div>
            <div className="text-center">End At</div>
            <div className="text-center">Created At</div>
          </div>

          {/* Match Rows */}
          {matches.map((match, index) => (
            <div
              key={match._id}
              className={`grid grid-cols-5 text-lg py-2 px-3 ${
                index < matches.length - 1 ? "border-b border-gray-700" : ""
              }`}
            >
              <div className="text-center">{match.mode_game}</div>
              <div className="text-center">{match.pooltable}</div>
              <div className="text-center">{match.status}</div>
              <div className="text-center">{new Date(match.endAt).toLocaleString()}</div>
              <div className="text-center">{new Date(match.createdAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}