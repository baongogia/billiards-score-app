import React, { useState, useEffect, useCallback } from "react";
import BidaTable from "../../components/BidaTable/page";
import "./index.scss";
import { useGame } from "../../context/GameContext";
import { ForwardIcon, UndoIcon } from "lucide-react";
import { GiPauseButton, GiPlayButton } from "react-icons/gi";

const GamePlay: React.FC = () => {
  const { gameType, firstTurn, timeLimit, playerName, partnerName } = useGame();
  const [currentPlayer, setCurrentPlayer] = useState(
    firstTurn === "player1" ? 1 : 2
  );
  const [timer, setTimer] = useState(timeLimit);
  const [paused, setPaused] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [balls, setBalls] = useState<number[]>(
    gameType === "8-ball"
      ? [1, 2, 3, 4, 5, 6, 7, 8]
      : [1, 2, 3, 4, 5, 6, 7, 8, 9]
  );
  const [history, setHistory] = useState<{ player: 1 | 2; ball: number }[]>([]);

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

    setBalls((prevBalls) => prevBalls.filter((b) => b !== ball));
    setHistory((prev) => [...prev, { player: currentPlayer as 1 | 2, ball }]);

    // Luật Bida 8: Đánh bi 8 hợp lệ cuối cùng thì thắng
    if (gameType === "8-ball" && ball === 8 && balls.length === 1) {
      setWinner(`🎉 ${currentPlayer === 1 ? playerName : playerName} Wins!`);
    }

    // Luật Bida 9: Đánh bi 9 hợp lệ thì thắng
    if (gameType === "9-ball" && ball === 9) {
      setWinner(`🎉 ${currentPlayer === 1 ? playerName : playerName} Wins!`);
    }
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

  const handlePause = () => {
    setPaused((prev) => !prev);
  };

  const handleRestart = () => {
    setBalls(
      gameType === "8-ball"
        ? [1, 2, 3, 4, 5, 6, 7, 8]
        : [1, 2, 3, 4, 5, 6, 7, 8, 9]
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
            className={`player-card w-[30%] flex justify-center items-center flex-col md:flex-row ${
              currentPlayer === 1 ? "active" : ""
            }`}
          >
            <img
              src="https://images.pexels.com/photos/6253978/pexels-photo-6253978.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="P1"
            />
            <div className="player-info">
              <p>{playerName}</p>
            </div>
          </div>

          <div className="timer w-[20%]">{timer}s</div>

          <div
            className={`player-card w-[30%] flex justify-center items-center flex-col md:flex-row ${
              currentPlayer === 2 ? "active" : ""
            }`}
          >
            <img
              src="https://images.pexels.com/photos/6253978/pexels-photo-6253978.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="P2"
            />
            <div className="player-info">
              <p>{partnerName}</p>
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
          <div className="bg-[rgba(255,255,255,0.5)] backdrop-blur-sm shadow-2xl w-50 h-30 p-6 rounded-lg text-center">
            <h2 className="text-xl text-white font-bold mb-3">{winner}</h2>
            <button
              onClick={handleRestart}
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-700 transition cursor-pointer"
            >
              Chơi lại
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamePlay;
