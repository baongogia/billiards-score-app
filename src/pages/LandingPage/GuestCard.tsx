import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../../context/GameContext";
interface GuestCardProps {
  id: string;
}
export const GuestCard: React.FC<GuestCardProps> = ({ id }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const navigate = useNavigate();
  const { guestHost, mode, gameType, setGameState } = useGame();

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-64 h-80 perspective-1000">
        <div
          className={`w-full h-full relative transition-transform duration-500 transform ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          <div className="absolute overflow-hidden scale-160 namecard w-full h-full p-2 bg-blue-500 text-white rounded-xl backface-hidden">
            {/* Card */}
            <div className={`${isFlipped ? "-rotate-y-180" : ""}`}>
              {isFlipped ? (
                <div className="flex flex-col justify-center gap-3">
                  <div className="w-full flex justify-center items-center">
                    <img
                      src="https://aobidathietke.com/wp-content/uploads/2023/04/Mau-Logo-Bida-Thiet-Ke-Dep-Danh-Cho-doi-Cau-Lac-Bo-Club-Quan-Billiards-2-400x400.png"
                      alt=""
                      className="h-31 scale-100 w-40"
                    />
                  </div>
                  <div className="uppercase font-bold text-center">
                    Select Your Game
                  </div>

                  {/* Mode Selection (Solo / Team) */}
                  <div className="flex gap-2">
                    <button
                      className={`w-1/2 h-9 text-white flex justify-center items-center font-bold border border-white transition duration-300 cursor-pointer
                        ${
                          mode === "solo"
                            ? "bg-green-500 text-black"
                            : "bg-[rgba(0,0,0,0.2)] hover:bg-green-500"
                        }`}
                      onClick={() => setGameState({ mode: "solo" })}
                    >
                      Solo
                    </button>
                    <button
                      className={`w-1/2 h-9 text-white flex justify-center items-center font-bold border border-white transition duration-300 cursor-pointer
                        ${
                          mode === "team"
                            ? "bg-red-500 text-black"
                            : "bg-[rgba(0,0,0,0.2)] hover:bg-red-500"
                        }`}
                      onClick={() => setGameState({ mode: "team" })}
                    >
                      Team
                    </button>
                  </div>

                  {/* Game Type Selection (Bida / Carom) */}
                  <div className="flex gap-2">
                    <button
                      className={`w-1/2 h-9 text-white flex justify-center items-center font-bold border border-white transition duration-300 cursor-pointer
                        ${
                          gameType === "bida"
                            ? "bg-yellow-500 text-black"
                            : "bg-[rgba(0,0,0,0.2)] hover:bg-yellow-500"
                        }`}
                      onClick={() => setGameState({ gameType: "bida" })}
                    >
                      Bida
                    </button>
                    <button
                      className={`w-1/2 h-9 text-white flex justify-center items-center font-bold border border-white transition duration-300 cursor-pointer
                        ${
                          gameType === "carom"
                            ? "bg-purple-500 text-black"
                            : "bg-[rgba(0,0,0,0.2)] hover:bg-purple-500"
                        }`}
                      onClick={() => setGameState({ gameType: "carom" })}
                    >
                      Carom
                    </button>
                  </div>

                  <div className="flex justify-end gap-1 mt-2">
                    <button
                      className="w-20 h-8 bg-[rgba(0,0,0,0.2)] text-white flex justify-center items-center font-bold border border-white transition duration-300 cursor-pointer hover:bg-gray-300 hover:text-black"
                      onClick={() => navigate(`/WaitingPage/${id}`)}
                    >
                      OK
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col justify-center gap-4">
                  <div className="w-full flex justify-center items-center">
                    <img
                      src="https://aobidathietke.com/wp-content/uploads/2023/04/Mau-Logo-Bida-Thiet-Ke-Dep-Danh-Cho-doi-Cau-Lac-Bo-Club-Quan-Billiards-2-400x400.png"
                      alt=""
                      className=" scale-150 h-37"
                    />
                  </div>
                  <div className="text-center font-bold">
                    Welcome to Billiards
                  </div>
                  <input
                    placeholder="Enter your name"
                    value={guestHost}
                    onChange={(e) =>
                      setGameState({ guestHost: e.target.value })
                    }
                    style={{
                      width: "100%",
                      height: "45px",
                      backgroundColor: "transparent",
                      border: "1px solid white",
                      padding: "5px",
                      borderRadius: "5px",
                      fontSize: "18px",
                      outline: "none",
                    }}
                  />
                  <div className="flex justify-end">
                    <button
                      className="w-20 h-10 bg-[rgba(0,0,0,0.2)] text-white flex justify-center items-center font-bold border border-white transition duration-300 cursor-pointer hover:bg-gray-300 hover:text-black"
                      onClick={() => setIsFlipped(!isFlipped)}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
