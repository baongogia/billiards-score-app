import React, { useState, useEffect, useCallback } from "react";
import BidaTable from "../../components/BidaTable/page";
import { useGame } from "../../context/GameContext";
import "./index.scss";

const GamePlay: React.FC = () => {
  const { gameType, firstTurn, timeLimit } = useGame();

  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState(
    firstTurn === "player1" ? 1 : 2
  );
  const [timer, setTimer] = useState(timeLimit);
  const [balls, setBalls] = useState<number[]>([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
  ]);
  const [paused, setPaused] = useState(false);
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
    if (paused) return;
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev > 0) return prev - 1;
        clearInterval(countdown);
        handleEndTurn();
        return 0;
      });
    }, 1000);
    return () => clearInterval(countdown);
  }, [paused, currentPlayer, handleEndTurn]);

  const handleBallClick = (ball: number) => {
    if (balls.includes(ball)) {
      setBalls((prevBalls) => prevBalls.filter((b) => b !== ball));
      setHistory((prev) => [...prev, { player: currentPlayer as 1 | 2, ball }]);

      if (gameType === "carom") {
        if (currentPlayer === 1) {
          setPlayer1Score((prev) => prev + ball);
        } else {
          setPlayer2Score((prev) => prev + ball);
        }
      }
    }
  };

  const handleUndo = () => {
    if (history.length > 0) {
      const lastMove = history.pop();
      if (lastMove) {
        setBalls((prevBalls) =>
          [...prevBalls, lastMove.ball].sort((a, b) => a - b)
        );

        if (gameType === "carom") {
          if (lastMove.player === 1) {
            setPlayer1Score((prev) => prev - lastMove.ball);
          } else {
            setPlayer2Score((prev) => prev - lastMove.ball);
          }
        }
      }
    }
  };

  const handlePause = () => {
    setPaused((prev) => !prev);
  };

  useEffect(() => {
    if (gameType === "bida" && balls.length === 0) {
      setTimeout(() => {
        alert(`🎉 Player ${currentPlayer} wins!`);
      }, 500);
    }

    if (gameType === "carom") {
      if (player1Score > 60) {
        alert("🎉 Player 1 Wins!");
      } else if (player2Score > 60) {
        alert("🎉 Player 2 Wins!");
      } else if (player1Score === 60 && player2Score === 60) {
        alert("🤝 It's a Draw!");
      }
    }
  }, [balls, player1Score, player2Score, gameType, currentPlayer]);

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
              <p>Player 1</p>
              {gameType === "carom" && <p className="score">{player1Score}</p>}
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
              <p>Player 2</p>
              {gameType === "carom" && <p className="score">{player2Score}</p>}
            </div>
          </div>
        </div>

        <div className="flex justify-center mt-4 space-x-3">
          <button onClick={handleUndo} className="control-button">
            Undo
          </button>
          <button onClick={handlePause} className="control-button">
            {paused ? "Resume" : "Pause"}
          </button>
          <button onClick={handleEndTurn} className="control-button">
            End Turn
          </button>
        </div>

        <div className="grid grid-cols-8 gap-3 p-4 rounded-lg mt-4">
          {Array.from({ length: 15 }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => handleBallClick(num)}
              className={`billiard-ball cursor-pointer ${
                !balls.includes(num) ? "opacity-20" : ""
              }`}
              data-pool={num}
            ></button>
          ))}
        </div>

        <div className="flex justify-center mt-4">
          <button
            onClick={() =>
              alert(
                player1Score > player2Score
                  ? "Player 1 Wins!"
                  : player2Score > player1Score
                  ? "Player 2 Wins!"
                  : "It's a Draw!"
              )
            }
            className="control-button"
          >
            🚩 End Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default GamePlay;
