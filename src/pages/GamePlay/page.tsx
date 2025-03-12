import React, { useState, useEffect } from "react";
import BidaTable from "../../components/BidaTable/page";
import "./index.scss";

const GamePlay: React.FC = () => {
  // Trạng thái game
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [timer, setTimer] = useState(300);
  const [balls, setBalls] = useState<number[]>([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
  ]);
  const [paused, setPaused] = useState(false);
  const [history, setHistory] = useState<{ player: 1 | 2; ball: number }[]>([]);

  // Ngăn cuộn trang
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Đếm ngược thời gian
  useEffect(() => {
    if (paused) return;
    const countdown = setInterval(() => {
      setTimer((prev) => {
        if (prev > 0) return prev - 1;
        clearInterval(countdown);
        handleEndTurn(); // Hết giờ => chuyển lượt
        return 0;
      });
    }, 1000);
    return () => clearInterval(countdown);
  }, [paused]);

  // Xử lý khi bi vào lỗ
  const handleBallClick = (ball: number) => {
    if (balls.includes(ball)) {
      setBalls((prevBalls) => prevBalls.filter((b) => b !== ball));
      setHistory((prev) => [...prev, { player: currentPlayer, ball }]);

      if (currentPlayer === 1) {
        setPlayer1Score((prev) => prev + ball);
      } else {
        setPlayer2Score((prev) => prev + ball);
      }
    }
  };

  // Hoàn tác nước đi gần nhất
  const handleUndo = () => {
    if (history.length > 0) {
      const lastMove = history.pop();
      if (lastMove) {
        setBalls((prevBalls) =>
          [...prevBalls, lastMove.ball].sort((a, b) => a - b)
        );

        if (lastMove.player === 1) {
          setPlayer1Score((prev) => prev - lastMove.ball);
        } else {
          setPlayer2Score((prev) => prev - lastMove.ball);
        }
      }
    }
  };

  // Chuyển lượt chơi
  const handleEndTurn = () => {
    setCurrentPlayer((prev) => (prev === 1 ? 2 : 1));
    setTimer(300);
  };

  // Dừng / tiếp tục game
  const handlePause = () => {
    setPaused((prev) => !prev);
  };

  // Xác định người chiến thắng
  useEffect(() => {
    if (balls.length === 0) {
      setTimeout(() => {
        const winner =
          player1Score > player2Score
            ? "Player 1 Wins!"
            : player2Score > player1Score
            ? "Player 2 Wins!"
            : "It's a Draw!";
        alert(winner);
      }, 500);
    }
  }, [balls, player1Score, player2Score]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="absolute">
        <BidaTable />
      </div>

      <div className="z-10 scale-200 w-[600px] p-6 rounded-xl">
        {/* Player Info */}
        <div className="flex justify-between items-center">
          {/* Player 1 */}
          <div className={`player-card ${currentPlayer === 1 ? "active" : ""}`}>
            <img
              src="https://images.pexels.com/photos/6253978/pexels-photo-6253978.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="P1"
            />
            <div className="player-info">
              <p>Player 1</p>
              <p className="score">{player1Score}</p>
            </div>
          </div>
          {/* Time */}
          <div className="timer">{timer}s</div>
          {/* Player 2 */}
          <div className={`player-card ${currentPlayer === 2 ? "active" : ""}`}>
            <div className="player-info mr-2">
              <p>Player 2</p>
              <p className="score">{player2Score}</p>
            </div>
            <img
              src="https://images.pexels.com/photos/6253978/pexels-photo-6253978.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="P2"
            />
          </div>
        </div>

        {/* Control Buttons */}
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

        {/* Balls State */}
        <div className="grid grid-cols-8 gap-3 p-4 rounded-lg mt-4">
          {Array.from({ length: 15 }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => handleBallClick(num)}
              className={`billiard-ball cursor-pointer ${
                !balls.includes(num) ? "hidden" : ""
              }`}
              data-pool={num}
            ></button>
          ))}
        </div>

        {/* End Game Button */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => {
              const winner =
                player1Score > player2Score
                  ? "Player 1 Wins!"
                  : player2Score > player1Score
                  ? "Player 2 Wins!"
                  : "It's a Draw!";
              alert(winner);
            }}
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
