/* eslint-disable @typescript-eslint/no-explicit-any */
import "./index.scss";
import Loading from "../../components/Loading/Loading";
import PlayerCard from "./PlayerCard";
import BidaTable from "../../components/BidaTable/page";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import {
  createMatch,
  getTableById,
} from "../../services/Admin/Matches/matchesService";
import { useGame } from "../../context/GameContext";

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
  const { tableId } = useParams();
  const [tableData, setTableData] = useState<any>(null);
  // Host luôn là người vào trước
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showAddPartnerModal, setShowAddPartnerModal] = useState(false);
  const [newPartnerName, setNewPartnerName] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const [gameMode, setGameMode] = useState("");
  const auth = useContext(AuthContext);
  const { playerName, setGameState } = useGame();

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
      const data = response.data.data;
      setTableData(data);
    } catch (error) {
      console.error("Error fetching table by id", error);
    }
  };

  useEffect(() => {
    if (tableId) {
      fetchTableById(tableId);
    }
  }, [tableId, gameSettings.gameType]);

  const createMatch = async () => {
    try {
      if (tableId && gameSettings.gameType) {
        await createMatch("ready", gameMode, tableId);
      } else {
        toast.error("Table ID is undefined");
      }
      toast.success("Match created successfully");
    } catch (error) {
      console.error("Error creating match", error);
      toast.error("Error creating match");
    }
  };

  const handleCreateMatch = (value: string) => {
    setGameSettings({
      ...gameSettings,
      gameType: value,
    });
    setGameMode(value);
  };

  return (
    <div className="relative w-[100vw] bg-green-950 h-[100vh] flex justify-center items-center">
      {/* Background */}
      <div className="absolute top-30 md:top-10">
        <BidaTable />
      </div>

      <div className="absolute md:scale-150 flex flex-col justify-center items-center ">
        <Loading />
        {/* 3 Nút chính của Host */}
        <div className="text-center text-white w-full h-10 flex gap-2">
          {auth?.token && (
            <button
              className="px-2 border-1 flex justify-center items-center uppercase font-bold  hover:bg-blue-500 transition duration-300 cursor-pointer text-white rounded"
              onClick={() => setShowInviteModal(true)}
            >
              Invite
            </button>
          )}
          <button
            className=" border-1 px-2 flex justify-center items-center uppercase font-bold  hover:bg-yellow-500 transition duration-300 cursor-pointer text-white rounded"
            onClick={() => setShowSetupModal(true)}
          >
            Setup
          </button>
          <button
            className={` border-1 px-2 flex justify-center items-center uppercase font-bold text-white text-nowrap rounded ${
              partnerName
                ? "bg-green-500 hover:bg-green-700 cursor-pointer"
                : "bg-gray-500 cursor-not-allowed"
            }`}
            onClick={() => partnerName && navigate("/GamePlay")}
            disabled={!partnerName}
          >
            Start Match
          </button>
          {!auth?.token && (
            <button
              className="px-2 border-1 flex justify-center items-center uppercase font-bold hover:bg-purple-500 transition duration-300 cursor-pointer text-white rounded"
              onClick={() => setShowAddPartnerModal(true)}
            >
              Add Partner
            </button>
          )}
        </div>
      </div>

      {/* Player Cards */}
      <div className="relative grid grid-cols-2 w-screen h-screen pointer-events-none">
        <PlayerCard className="player-1" name={`${playerName} (HOST)`} />
        {partnerName && <PlayerCard className="player-2" name={partnerName} />}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="absolute w-full h-full bg-[rgba(0,0,0,0.7)] flex justify-center items-center">
          <div className="bg-[rgba(255,255,255,0.5)] backdrop-blur-md  p-5 rounded-lg w-80 text-white">
            <h2 className="text-xl font-bold mb-3">Invite Player</h2>
            <div className="p-2 border rounded mb-3">
              <p className="text-gray-700">🔵 Nobita</p>
              <button
                className="w-full bg-blue-500 text-white py-2 mt-2 rounded hover:bg-blue-700 transition uppercase cursor-pointer"
                onClick={() => {
                  setPartnerName("Nobita");
                  setGameState({ partnerName: "Nobita" });
                  setShowInviteModal(false);
                }}
              >
                Invite
              </button>
            </div>
            <button
              className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-700 transition cursor-pointer"
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
          <div className="bg-[rgba(255,255,255,0.5)] backdrop-blur-md p-5 rounded-lg w-80 text-white">
            <h2 className="text-xl font-bold mb-3">Setup Match</h2>

            {/* Chọn chế độ Bida */}
            <div className="mb-3">
              <label className="text-sm">Game Mode</label>
              <select
                className="w-full p-2 border rounded text-black"
                value={gameSettings.gameType}
                onChange={(e) => handleCreateMatch(e.target.value)}
              >
                <option key={""} value={""}></option>
                {tableData?.tableType?.compatible_mode.map((mode: any) => (
                  <option key={mode} value={mode}>
                    {mode}
                  </option>
                ))}
              </select>
            </div>

            {/* Chọn thời gian chơi */}
            <div className="mb-3">
              <label className="text-sm">Time Limit (seconds)</label>
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
              <label className="text-sm">Who Plays First?</label>
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
                <option value="player1">{playerName}</option>
                <option value="player2">{partnerName}</option>
              </select>
            </div>

            {/* Save & Close */}
            <div className="flex justify-between">
              <button
                className="w-[48%] bg-green-500 opacity-80 text-white py-2 rounded hover:bg-green-700 transition cursor-pointer"
                onClick={() => {
                  setGameState(gameSettings);
                  setShowSetupModal(false);
                  if (auth?.token) {
                    createMatch();
                  }
                }}
              >
                Save
              </button>
              <button
                className="w-[48%] bg-red-500 text-white py-2 rounded hover:bg-red-700 transition opacity-80 cursor-pointer"
                onClick={() => setShowSetupModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Partner Modal */}
      {showAddPartnerModal && (
        <div className="absolute w-full h-full bg-[rgba(0,0,0,0.7)] flex justify-center items-center">
          <div className="bg-[rgba(255,255,255,0.5)] backdrop-blur-md p-5 rounded-lg w-80 text-white">
            <h2 className="text-xl font-bold mb-3">Add Partner</h2>
            <input
              type="text"
              className="w-full p-2 border rounded text-black mb-3"
              placeholder="Enter partner's name"
              value={newPartnerName}
              onChange={(e) => setNewPartnerName(e.target.value)}
            />
            <div className="flex justify-between">
              <button
                className="w-[48%] bg-green-500 text-white py-2 rounded hover:bg-green-700 transition cursor-pointer"
                onClick={() => {
                  if (newPartnerName.trim()) {
                    setPartnerName(newPartnerName);
                    setGameState({ partnerName: newPartnerName });
                    setShowAddPartnerModal(false);
                  }
                }}
              >
                Save
              </button>
              <button
                className="w-[48%] bg-red-500 text-white py-2 rounded hover:bg-red-700 transition cursor-pointer"
                onClick={() => setShowAddPartnerModal(false)}
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
