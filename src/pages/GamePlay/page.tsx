import React, { useState, useEffect } from "react";
import BidaTable from "../../components/BidaTable/page";

const GamePlay: React.FC = () => {
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState<1 | 2>(1);
  const [timer, setTimer] = useState(300);
  const [balls, setBalls] = useState<number[]>([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
  ]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(countdown);
  }, []);

  // Xử lý khi người chơi bấm vào bi (bi vào lỗ)
  const handleBallClick = (ball: number) => {
    setBalls((prevBalls) => prevBalls.filter((b) => b !== ball));
    if (currentPlayer === 1) {
      setPlayer1Score((prev) => prev + ball);
    } else {
      setPlayer2Score((prev) => prev + ball);
    }
  };

  // Chuyển lượt chơi
  const handleEndTurn = () => {
    setCurrentPlayer((prev) => (prev === 1 ? 2 : 1));
    setTimer(300);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="absolute top-14">
        <BidaTable />
      </div>
      <div className="z-10 w-[600px] bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
        {/* Player Info */}
        <div className="flex justify-between items-center">
          <div
            className={`flex items-center space-x-2 p-2 rounded-lg ${
              currentPlayer === 1 ? "bg-blue-600" : "bg-gray-700"
            }`}
          >
            <img
              src="/player1.jpg"
              className="w-10 h-10 rounded-full"
              alt="P1"
            />
            <div>
              <p className="text-white font-bold">Player 1</p>
              <p className="text-white text-xl">{player1Score}</p>
            </div>
          </div>

          <div className="text-yellow-500 text-3xl font-bold bg-black px-4 py-1 rounded-md">
            {timer}s
          </div>

          <div
            className={`flex items-center space-x-2 p-2 rounded-lg ${
              currentPlayer === 2 ? "bg-blue-600" : "bg-gray-700"
            }`}
          >
            <div>
              <p className="text-white font-bold">Player 2</p>
              <p className="text-white text-xl">{player2Score}</p>
            </div>
            <img
              src="/player2.jpg"
              className="w-10 h-10 rounded-full"
              alt="P2"
            />
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex justify-center mt-4 space-x-3">
          <button className="px-4 py-2 bg-gray-700 text-white rounded-lg">
            ⟲ Undo
          </button>
          <button className="px-4 py-2 bg-gray-700 text-white rounded-lg">
            ⏸ Pause
          </button>
          <button
            onClick={handleEndTurn}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg"
          >
            ⏭ End Turn
          </button>
          <button className="px-4 py-2 bg-gray-700 text-white rounded-lg">
            ⚠ Foul
          </button>
        </div>

        {/* Balls State */}
        <div className="grid grid-cols-8 gap-3 bg-gray-700 p-4 rounded-lg mt-4">
          {Array.from({ length: 15 }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => handleBallClick(num)}
              className={`w-10 h-10 text-white rounded-full text-lg font-bold ${
                balls.includes(num) ? "bg-blue-500" : "bg-gray-500 opacity-50"
              }`}
            >
              {num}
            </button>
          ))}
        </div>

        {/* End Game Button */}
        <div className="flex justify-center mt-4">
          <button className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg">
            🚩 End Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default GamePlay;
