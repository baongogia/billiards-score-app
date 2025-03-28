/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useCallback, useContext } from "react";
import BidaTable from "../../components/BidaTable/page";
import "./index.scss";
import { useGame } from "../../context/GameContext";
import { ForwardIcon, UndoIcon } from "lucide-react";
import { GiPauseButton, GiPlayButton } from "react-icons/gi";
import { useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { findUser } from "../../services/auth/authService";
import { toast } from "react-toastify";
import { useSocket } from "../../hooks/useSocket";

const GamePlay: React.FC = () => {
  const {
    gameType,
    firstTurn,
    timeLimit,
    playerName,
    partnerName,
    setGameState,
  } = useGame();
  const { matchId } = useParams();
  const { socket } = useSocket();
  const [currentPlayer, setCurrentPlayer] = useState(
    firstTurn === "player1" ? 1 : 2
  );
  const [timer, setTimer] = useState(timeLimit);
  const [paused, setPaused] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [balls, setBalls] = useState<number[]>(
    gameType === "8-ball"
      ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] // 15 quả cho 8-ball
      : [1, 2, 3, 4, 5, 6, 7, 8, 9] // 9 quả cho 9-ball
  );
  const [history, setHistory] = useState<{ player: 1 | 2; ball: number }[]>([]);
  const navigate = useNavigate();
  const tableId = localStorage.getItem("tableId");
  const [allUserData, setAllUserData] = useState<any>(null);
  const [storedPlayerName, setStoredPlayerName] = useState<string | null>(null);
  const auth = useContext(AuthContext);

  useEffect(() => {
    const savedPlayerName = localStorage.getItem("playerName");
    if (savedPlayerName && storedPlayerName !== savedPlayerName) {
      setStoredPlayerName(savedPlayerName);
      setGameState({ playerName: savedPlayerName });
    }
  }, [storedPlayerName, setGameState]);

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
    if (tableId) {
      localStorage.setItem("tableId", tableId);
    }
    fetchUserData();
  }, [tableId, fetchUserData]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleEndTurn = useCallback(() => {
    setCurrentPlayer((prev) => (prev === 1 ? 2 : 1));
    setTimer(timeLimit);
  }, [timeLimit]);

  useEffect(() => {
    if (paused || winner) return;
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev > 0) return prev - 1;
        clearInterval(countdown);
        handleEndTurn();
        return 0;
      });
    }, 1000);
    return () => clearInterval(countdown);
  }, [paused, currentPlayer, handleEndTurn, winner]);

  const handleBallClick = (ball: number) => {
    if (!balls.includes(ball) || winner) return;
    socket.emit("pottedBall", {
      matchId,
      ballIndex: ball,
      ballType: "default",
    });
    setBalls((prevBalls) => prevBalls.filter((b) => b !== ball));
    setHistory((prev) => [...prev, { player: currentPlayer as 1 | 2, ball }]);

    if (gameType === "8-ball" && ball === 8 && balls.length === 1) {
      setWinner(`🎉 ${currentPlayer === 1 ? playerName : partnerName} Wins!`);
    }

    if (gameType === "9-ball" && ball === 9) {
      setWinner(`🎉 ${currentPlayer === 1 ? playerName : partnerName} Wins!`);
    }
  };

  // #region Socket events
  // Socket lắng nghe sự kiện "ballPottedUpdate"
  useEffect(() => {
    socket.on("ballPottedUpdate", (data: any) => {
      if (data?.ballIndex !== undefined) {
        setBalls((prevBalls) => prevBalls.filter((b) => b !== data.ballIndex));
        setHistory((prev) => [
          ...prev,
          { player: currentPlayer as 1 | 2, ball: data.ballIndex },
        ]);
      }
    });

    return () => {
      socket.off("ballPottedUpdate");
    };
  }, [currentPlayer, socket]);

  // Lắng nghe sự kiện waitingRoomPlayers từ server
  const [hostName, setHostName] = useState<string | null>("");
  const [hostAvatar, setHostAvatar] = useState<string>("");
  const [player, setPlayer] = useState<{ name: string }[] | null>(null);

  useEffect(() => {
    const handler = (data: any) => {
      console.log("[waitingRoomPlayers] received:", data);

      // Nếu là host (allUserData trùng với hostName) → set host
      if (allUserData?.name === data.hostName) {
        setHostName(data.hostName);
        setHostAvatar(data.hostImg);
      }

      // Nếu là guest (khác host) → vẫn set host
      if (!allUserData || allUserData?.name !== data.hostName) {
        setHostName(data.hostName);
        setHostAvatar(data.hostImg);
      }

      setPlayer(data.players);
    };

    socket.on("waitingRoomPlayers", handler);
    return () => {
      socket.off("waitingRoomPlayers", handler);
    };
  }, [socket, allUserData]);

  useEffect(() => {
    if (!matchId) return;

    if (allUserData) {
      socket.emit("getWaitingRoomPlayers", {
        matchId,
        hostName: allUserData?.name,
        hostImg: allUserData?.avatar,
      });
    } else {
      socket.emit("getWaitingRoomPlayers", { matchId });
    }
  }, [matchId, allUserData, socket]);
  // #endregion

  const handlePause = () => {
    setPaused((prev) => !prev);
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const lastMove = history.pop();
      if (lastMove) {
        setBalls((prevBalls) =>
          [...prevBalls, lastMove.ball].sort((a, b) => a - b)
        );
      }
    }
  };

  const handleRestart = () => {
    setBalls(
      gameType === "8-ball"
        ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] // 15 quả cho 8-ball
        : [1, 2, 3, 4, 5, 6, 7, 8, 9] // 9 quả cho 9-ball
    );
    setWinner(null);
    setTimer(timeLimit);
    setHistory([]);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-green-950">
      <div className="absolute top-30 md:top-10">
        <BidaTable />
      </div>

      <div className="z-10 md:scale-200 md:w-[600px] p-6 rounded-xl">
        <div className="text-center text-white font-bold mb-3">
          <p className="uppercase">{gameType}</p>
        </div>

        <div className="flex justify-between items-center">
          <div
            className={`player-card w-[35%] flex justify-center items-center ${
              currentPlayer === 1 ? "active" : ""
            }`}
          >
            <img
              src={
                hostAvatar ||
                allUserData?.avatar ||
                "https://images.pexels.com/photos/5986316/pexels-photo-5986316.jpeg?auto=compress&cs=tinysrgb&w=1200"
              }
              alt="P1"
            />
            <div
              style={{ textShadow: "black 1px 0 10px;" }}
              className="player-info"
            >
              <p>{hostName || storedPlayerName}</p>
            </div>
          </div>

          <div className="timer w-[20%]">{timer}s</div>

          <div
            className={`player-card w-[35%] flex justify-center items-center flex-col md:flex-row ${
              currentPlayer === 2 ? "active" : ""
            }`}
          >
            <img
              src="https://images.pexels.com/photos/5986316/pexels-photo-5986316.jpeg?auto=compress&cs=tinysrgb&w=1200"
              alt="P2"
            />
            <div className="player-info">
              <p>{player?.[1]?.name}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-4 space-x-3">
          <button onClick={handleUndo} className="control-button">
            <UndoIcon size={24} />
            Undo
          </button>
          <button onClick={handlePause} className="control-button">
            {paused ? <GiPlayButton /> : <GiPauseButton />}
            {paused ? "Resume" : "Pause"}
          </button>
          <button onClick={handleEndTurn} className="control-button">
            End Turn
            <ForwardIcon size={24} />
          </button>
        </div>

        <div className="grid grid-cols-8 gap-3 p-4 rounded-lg mt-4">
          {balls.map((num) => (
            <button
              key={num}
              onClick={() => handleBallClick(num)}
              className="billiard-ball cursor-pointer"
              data-pool={num}
            ></button>
          ))}
        </div>

        <div className="flex justify-center mt-4">
          <button
            onClick={() => setWinner("Game Over!")}
            className="control-button"
          >
            🚩 End Game
          </button>
        </div>
      </div>

      {/* Modal thông báo thắng */}
      {winner && (
        <div className="fixed inset-0 bg-[rgba(0,0,0,0.4)] flex justify-center items-center z-10">
          <div className="bg-[rgba(255,255,255,0.5)] backdrop-blur-sm shadow-2xl w-80 h-40 p-6 rounded-lg text-center">
            <p className="text-lg text-white font-bold mb-3">{winner}</p>
            <h2 className="text-xl text-white font-bold mb-3">
              Người chiến thắng là:{" "}
              {currentPlayer === 1 ? playerName : partnerName}
            </h2>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  navigate(
                    `/WaitingPage/${tableId}/${!auth?.token ? matchId : ""}`
                  )
                }
                className="w-full bg-red-600 text-white py-2 rounded hover:bg-green-700 transition cursor-pointer"
              >
                Thoát
              </button>
              <button
                onClick={handleRestart}
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition cursor-pointer"
              >
                Chơi lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamePlay;
