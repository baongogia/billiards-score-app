/* eslint-disable @typescript-eslint/no-explicit-any */
import "./index.scss";
import Loading from "../../components/Loading/Loading";
import PlayerCard from "./PlayerCard";
import BidaTable from "../../components/BidaTable/page";
import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import { getTableById } from "../../services/Admin/Matches/matchesService";
import { useGame } from "../../context/GameContext";
import { findUser } from "../../services/auth/authService";
import { useSocket } from "../../hooks/useSocket";

interface GameState {
  playerName: string;
  mode: string;
  gameType: string;
  firstTurn: string;
  timeLimit: number;
  setGameState: (newState: Partial<GameState>) => void;
}

export default function WaitingPage() {
  // #region State and Context
  const navigate = useNavigate();
  const { tableId, matchId } = useParams();
  const { socket } = useSocket();
  const auth = useContext(AuthContext);
  const [tableData, setTableData] = useState<any>(null);
  const [players, setPlayers] = useState<string[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showAddPartnerModal, setShowAddPartnerModal] = useState(false);
  const [newPartnerName, setNewPartnerName] = useState("");
  const [partnerName, setPartnerName] = useState("");
  const { playerName, setGameState } = useGame();
  const [storedPlayerName, setStoredPlayerName] = useState<string | null>(null);
  const [allUserData, setAllUserData] = useState<any>(null);
  const [matchData, setMatchData] = useState<any>(null);
  const [showGuestNameModal, setShowGuestNameModal] = useState(false);
  const [guestNameInput, setGuestNameInput] = useState("");
  const [hostName, setHostName] = useState<string | null>(
    `${auth?.token ? playerName : guestNameInput}`
  );
  const [hostAvatar, setHostAvatar] = useState<string>("");
  const serverhost = "http://localhost:3003";
  // const serverhost = "https://billiards-score-app.vercel.app";
  const matchLink = `${serverhost}/WaitingPage/${tableId}/${matchData?.matchId}`;
  // #endregion
  // Get user data
  const fetchUserData = useCallback(async () => {
    try {
      if (!auth?.user?._id) {
        throw new Error("User ID is undefined");
      }
      const res = await findUser(auth.user._id);
      const allUserData = res.data.data;
      setAllUserData(allUserData);
    } catch (error: any) {
      toast.error(error);
    }
  }, [auth]);

  useEffect(() => {
    if (!auth?.user) {
      navigate("/login");
    }
  }, [auth, navigate]);

  //#region Game settings
  const [gameSettings, setGameSettings] = useState<Partial<GameState>>({
    gameType: "bida",
    timeLimit: 60,
    firstTurn: "player1",
  });

  useEffect(() => {
    if (tableId) {
      localStorage.setItem("tableId", tableId);
    }
  }, [tableId]);

  // Get player name
  useEffect(() => {
    if (playerName) {
      localStorage.setItem("userName", playerName);
      if (!matchId) {
        setPlayers([playerName]);
      }
    }
    fetchUserData();
  }, [playerName, fetchUserData, socket, matchId]);

  useEffect(() => {
    const savedPlayerName = localStorage.getItem("userName");
    if (savedPlayerName && storedPlayerName !== savedPlayerName) {
      setStoredPlayerName(savedPlayerName);
      setGameState({ playerName: savedPlayerName });
    }
  }, [storedPlayerName, setGameState]);

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
  // Create match
  const handleCreateMatch = (value: string) => {
    setGameSettings({
      ...gameSettings,
      gameType: value,
    });
  };

  // Disable scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  // #endregion
  // Socket waiting room
  useEffect(() => {
    // Show guest name modal if no player name is set - guest
    const storedGuestName = localStorage.getItem("guestName");
    if (!auth?.token && !playerName) {
      if (storedGuestName) {
        setGuestNameInput(storedGuestName);
      } else {
        setShowGuestNameModal(true);
      }
      return;
    }
    // Handle player join room - guest
    if (matchId) {
      socket.emit("joinRoom", { matchId, guestName: playerName });
      socket.on("waitingRoomPlayers", (data: any) => {
        if (data) {
          setHostName(data.hostName);
          setHostAvatar(data.hostImg);
          const names =
            data.players?.map((p: any) => p.name).filter(Boolean) || [];
          const uniqueNames = Array.from(new Set([data.hostName, ...names]));
          setPlayers(uniqueNames);
          const otherPlayers = uniqueNames.filter(
            (name) => name !== playerName
          );
          if (otherPlayers.length > 0) {
            setGameState({
              playerName,
              partnerName: otherPlayers[0],
            });
          }
        } else {
          toast.error("Error fetching waiting room players");
        }
      });
      socket.on("roomJoined", (data) => {
        if (data?.guestName) {
          setPlayers((prev) => {
            if (!prev.includes(data.guestName)) {
              return [...prev, data.guestName];
            }
            return prev;
          });
          toast.success(`${data.guestName} joined the room!`);
        }
      });

      // Handle player join room - host
    } else {
      socket.emit("createRoom", { tableId });
      socket.on("roomCreated", (data: any) => {
        setMatchData(data);
        setHostName(playerName);
        setPlayers([playerName]);
        localStorage.setItem("matchData", JSON.stringify(data));
        if (data.matchId && playerName && allUserData?.avatar) {
          socket.emit("getWaitingRoomPlayers", {
            matchId: data.matchId,
            hostName: playerName,
            hostImg: allUserData.avatar,
          });
          toast.success("Waiting room created!");
        } else {
          console.warn("Missing data to emit getWaitingRoomPlayers:", {
            matchId: data.matchId,
            playerName,
            avatar: allUserData?.avatar,
          });
        }
      });
      socket.on("userJoined", (data: any) => {
        setPlayers([playerName, data.guestName]);
        toast.success(`${data.guestName} joined the room!`);
        socket.emit("getWaitingRoomPlayers", {
          matchId: matchData.matchId,
          hostName: playerName,
          hostImg: allUserData.avatar,
        });
      });
    }
    return () => {
      socket.off("roomCreated");
      socket.off("roomJoined");
      socket.off("userJoined");
    };
  }, [
    auth?.token,
    matchId,
    playerName,
    setGameState,
    socket,
    tableId,
    allUserData,
    matchData,
    hostName,
  ]);

  // Socket events start match
  useEffect(() => {
    socket.on("startGame", () => {
      navigate(`/GamePlay/${matchId || matchData?.matchId}`);
      toast.success("Match started!");
    });

    return () => {
      socket.off("startGame");
    };
  }, [socket, navigate, matchId, matchData?.matchId]);

  return (
    <div className="relative w-[100vw] bg-green-950 h-[100vh] flex justify-center items-center">
      {/* Background */}
      <div className="absolute top-30 md:top-10">
        <BidaTable />
      </div>

      {/* Button */}
      <div className="absolute md:scale-150 flex flex-col justify-center items-center ">
        <Loading />
        {/* 3 Nút chính của Host */}
        <div className="text-center text-white w-full h-10 flex gap-2">
          {auth?.token && (
            <button
              className="px-2 border-1 flex justify-center items-center uppercase font-bold  hover:bg-cyan-700 transition duration-300 cursor-pointer text-white rounded"
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
            className={`border-1 px-2 flex justify-center items-center uppercase font-bold text-white text-nowrap rounded ${players.length === 2
              ? "hover:bg-green-700 cursor-pointer"
              : "bg-gray-500 cursor-not-allowed"
              }`}
            disabled={players.length < 2}
            onClick={() => {
              if (players.length > 1 && matchData?.matchId) {
                socket.emit("startGame", { matchId: matchData.matchId });
              }
            }}
          >
            Start Match
          </button>

          <button
            className=" border-1 px-2 flex justify-center items-center uppercase font-bold  hover:bg-red-700 transition duration-300 cursor-pointer text-white rounded"
            onClick={() => {
              navigate(auth?.token ? "/HomePage" : `/${tableId}`);
              setPlayers([]);
              localStorage.removeItem("tableId");
            }}
          >
            Leave Room
          </button>
        </div>
      </div>

      {/* Player Cards */}
      <div className="relative grid grid-cols-2 w-screen h-screen pointer-events-none">
        <PlayerCard
          className="player-1 text-center"
          name={`${hostName} (HOST)`}
          data={allUserData}
          avatar={hostAvatar}
        />
        {players.length > 1 && (
          <PlayerCard className="player-2" name={players[1]} />
        )}
        {players.length > 2 && (
          <PlayerCard className="player-3" name={players[2]} />
        )}
        {players.length > 3 && (
          <PlayerCard className="player-4" name={players[3]} />
        )}

        {players.length > 4 && toast.warning("Full room!")}
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="absolute w-full h-full bg-[rgba(0,0,0,0.7)] flex justify-center items-center">
          <div className="bg-[rgba(255,255,255,0.5)] backdrop-blur-md  p-5 rounded-lg w-72 text-white">
            <h2 className="text-xl font-bold mb-3">Invite Player</h2>
            {matchData?.matchId ? (
              <div className="object-cover w-full mb-4">
                <QRCodeCanvas value={matchLink} size={250} />
                <div className="h-4 bg-amber-300 p-2 rounded-4xl">
                  {matchLink}
                </div>
              </div>
            ) : (
              <Loading />
            )}
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
                <option value=""></option>
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
                <option value="player1">
                  {playerName || auth?.user?.email}
                </option>
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
                    setPlayers((prevPlayers) => [
                      ...prevPlayers,
                      newPartnerName,
                    ]);
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

      {/* Guest Name Modal */}
      {showGuestNameModal && (
        <div className="absolute w-full h-full bg-[rgba(0,0,0,0.7)] flex justify-center items-center">
          <div className="bg-[rgba(255,255,255,0.5)] backdrop-blur-md p-5 rounded-lg w-80 text-white">
            <h2 className="text-xl font-bold mb-3">Enter Your Name</h2>
            <input
              type="text"
              className="w-full p-2 border rounded text-black mb-3"
              placeholder="Your name"
              value={guestNameInput}
              onChange={(e) => setGuestNameInput(e.target.value)}
            />
            <div className="flex justify-between">
              <button
                className="w-[48%] bg-green-500 text-white py-2 rounded hover:bg-green-700 transition cursor-pointer"
                onClick={() => {
                  if (guestNameInput.trim()) {
                    setGameState({ playerName: guestNameInput });
                    localStorage.setItem("playerName", guestNameInput);
                    setShowGuestNameModal(false);
                    localStorage.setItem("guestName", guestNameInput);
                  }
                }}
              >
                Join
              </button>
              <button
                className="w-[48%] bg-red-500 text-white py-2 rounded hover:bg-red-700 transition cursor-pointer"
                onClick={() => {
                  setGuestNameInput("");
                  setShowGuestNameModal(false);
                  navigate(`/${tableId}`);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Style */}
      <style>{`
        .player-1 { position: absolute; bottom: 25px; left: 25px; }
        .player-2 { position: absolute; bottom: 25px; right: 25px; }
        .player-3 { position: absolute; top: 25px; right: 25px; }
        .player-4 { position: absolute; top: 25px; left: 25px; }
      `}</style>
    </div>
  );
}
