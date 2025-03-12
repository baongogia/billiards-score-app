/* eslint-disable @typescript-eslint/no-explicit-any */
import "./index.scss";
import Loading from "../../components/Loading/Loading";
import PlayerCard from "./PlayerCard";
import BidaTable from "../../components/BidaTable/page";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGame } from "../../context/GameContext";
import {
  createNewMatch,
  getTableById,
} from "../../services/Match/matchService";
import { toast } from "react-toastify";

interface GameState {
  playerName: string;
  mode: string;
  gameType: string;
  firstTurn: string;
  timeLimit: number;
  setGameState: (newState: Partial<GameState>) => void;
}

export default function WaitingPage() {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const navigate = useNavigate();
  const { setGameState } = useGame();
  const { tableId } = useParams();
  console.log("tableId", tableId);
  const [tableData, setTableData] = useState<any>(null);
  // Host luôn là người vào trước
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [partnerName, setPartnerName] = useState("");

  // Game settings
  const [gameSettings, setGameSettings] = useState<Partial<GameState>>({
    gameType: "bida",
    timeLimit: 60,
    firstTurn: "player1",
  });

  // Create a new match
  const fetchTableById = async (id: string) => {
    try {
      const response = await getTableById(id);
      const data = response.data;
      setTableData(data);
    } catch (error) {
      console.error("Error fetching table by id", error);
    }
  };

  useEffect(() => {
    const createMatch = async () => {
      try {
        if (tableId && gameSettings.gameType) {
          await createNewMatch("ready", gameSettings.gameType, tableId);
        } else {
          toast.error("Table ID is undefined");
        }
        toast.success("Match created successfully");
      } catch (error) {
        console.error("Error creating match", error);
        toast.error("Error creating match");
      }
    };

    if (tableId) {
      fetchTableById(tableId);
      createMatch();
    }
  }, [tableId, gameSettings.gameType]);

  return (
    <div className="relative w-[100vw] bg-green-950 h-[100vh] flex justify-center items-center">
      {/* Background */}
      <div className="absolute top-30 md:top-10">
        <BidaTable />
      </div>

      <div className="absolute scale-150 flex flex-col">
        <Loading />
        {/* 3 Nút chính của Host */}
        <div className="text-center text-white w-full h-10 flex gap-2">
          <button
            className="w-1/3 border-1 flex justify-center items-center uppercase font-bold bg-blue-500 hover:bg-blue-700 transition duration-300 cursor-pointer text-white rounded"
            onClick={() => setShowInviteModal(true)}
          >
            Invite
          </button>
          <button
            className="w-1/3 border-1 flex justify-center items-center uppercase font-bold bg-yellow-500 hover:bg-yellow-700 transition duration-300 cursor-pointer text-white rounded"
            onClick={() => setShowSetupModal(true)}
          >
            Setup
          </button>
          <button
            className={`w-1/3 border-1 flex justify-center items-center uppercase font-bold text-white rounded ${
              partnerName
                ? "bg-green-500 hover:bg-green-700 cursor-pointer"
                : "bg-gray-500 cursor-not-allowed"
            }`}
            onClick={() => partnerName && navigate("/GamePlay")}
            disabled={!partnerName}
          >
            Start Match
          </button>
        </div>
      </div>

      {/* Player Cards */}
      <div className="relative grid grid-cols-2 w-screen h-screen pointer-events-none">
        <PlayerCard className="player-1" name="YOU (Host)" />
        {partnerName && <PlayerCard className="player-2" name={partnerName} />}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="absolute w-full h-full bg-[rgba(0,0,0,0.7)] flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg w-80 text-black">
            <h2 className="text-xl font-bold mb-3">Invite Player</h2>
            <div className="p-2 border rounded mb-3">
              <p className="text-gray-700">🔵 Player Online: John Doe</p>
              <button
                className="w-full bg-blue-500 text-white py-2 mt-2 rounded hover:bg-blue-700 transition"
                onClick={() => {
                  setPartnerName("John Doe");
                  setShowInviteModal(false);
                }}
              >
                Invite John
              </button>
            </div>
            <button
              className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-700 transition"
              onClick={() => setShowInviteModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Setup Modal */}
      {showSetupModal && (
        <div className="absolute w-full h-full bg-[rgba(0,0,0,0.7)] flex justify-center items-center">
          <div className="bg-white p-5 rounded-lg w-80 text-black">
            <h2 className="text-xl font-bold mb-3">Setup Match</h2>

            {/* Chọn chế độ Bida */}
            <div className="mb-3">
              <label className="block text-sm">Game Mode</label>
              <select
                className="w-full p-2 border rounded text-black"
                value={gameSettings.gameType}
                onChange={(e) =>
                  setGameSettings({
                    ...gameSettings,
                    gameType: e.target.value,
                  })
                }
              >
                {tableData.compatible_modes.map((mode: any) => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
            </div>

            {/* Chọn thời gian chơi */}
            <div className="mb-3">
              <label className="block text-sm">Time Limit (seconds)</label>
              <input
                type="number"
                className="w-full p-2 border rounded text-black"
                value={gameSettings.timeLimit}
                onChange={(e) =>
                  setGameSettings({
                    ...gameSettings,
                    timeLimit: Number(e.target.value),
                  })
                }
              />
            </div>

            {/* Chọn người đánh trước */}
            <div className="mb-3">
              <label className="block text-sm">Who Plays First?</label>
              <select
                className="w-full p-2 border rounded text-black"
                value={gameSettings.firstTurn}
                onChange={(e) =>
                  setGameSettings({
                    ...gameSettings,
                    firstTurn: e.target.value,
                  })
                }
              >
                <option value="player1">Player 1</option>
                <option value="player2">Player 2</option>
              </select>
            </div>

            {/* Save & Close */}
            <div className="flex justify-between">
              <button
                className="w-[48%] bg-green-500 text-white py-2 rounded hover:bg-green-700 transition"
                onClick={() => {
                  setGameState(gameSettings);
                  setShowSetupModal(false);
                }}
              >
                Save
              </button>
              <button
                className="w-[48%] bg-red-500 text-white py-2 rounded hover:bg-red-700 transition"
                onClick={() => setShowSetupModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .player-1 { position: absolute; bottom: 25px; left: 25px; }
        .player-2 { position: absolute; bottom: 25px; right: 25px; }
      `}</style>
    </div>
  );
}
