import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function GuestCard() {
  const [isFlipped, setIsFlipped] = useState(false);
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-64 h-80 perspective-1000">
        <div
          className={`w-full h-full relative transition-transform duration-500 transform ${
            isFlipped ? "rotate-y-180" : ""
          }`}
        >
          <div
            className={`absolute overflow-hidden scale-160 namecard w-full h-full p-2 bg-blue-500 text-white rounded-xl backface-hidden `}
          >
            {/* Card */}
            <div className={`${isFlipped ? "-rotate-y-180 " : ""}`}>
              {isFlipped ? (
                <div className="flex flex-col justify-center gap-1">
                  <div className="w-full flex justify-center items-center">
                    <img
                      src="https://aobidathietke.com/wp-content/uploads/2023/04/Mau-Logo-Bida-Thiet-Ke-Dep-Danh-Cho-doi-Cau-Lac-Bo-Club-Quan-Billiards-2-400x400.png"
                      alt=""
                      className="h-39 scale-130 w-40"
                    />
                  </div>
                  <div className={`uppercase font-bold`}>Select yout game</div>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <div
                        className="w-1/2 h-9 bg-[rgba(0,0,0,0.2)] text-white flex justify-center items-center
                             font-bold hover:bg-[rgba(134,255,136,0.2)]  transition duration-300 cursor-pointer border-1"
                        onClick={() => navigate("/WaitingPage")}
                      >
                        Solo
                      </div>
                      <div
                        className="w-1/2 h-9 bg-[rgba(0,0,0,0.2)] text-white flex justify-center items-center
                             font-bold hover:bg-[rgba(255,137,137,0.2)]  transition duration-300 cursor-pointer border-1"
                        onClick={() => navigate("/WaitingPage")}
                      >
                        Team
                      </div>
                    </div>
                    <div
                      className="w-full h-9 bg-[rgba(0,0,0,0.2)] text-white flex justify-center items-center
                             font-bold hover:bg-[rgba(255,245,137,0.2)]  transition duration-300 cursor-pointer border-1"
                      onClick={() => navigate("/WaitingPage")}
                    >
                      Vs AI
                    </div>
                  </div>
                  <div className="flex justify-end gap-1">
                    <div
                      className="w-20 h-8 bg-[rgba(0,0,0,0.2)] text-white flex justify-center items-center
                             font-bold hover:bg-[rgba(225,225,225,0.2)]  transition duration-300 cursor-pointer border-1"
                      onClick={() => setIsFlipped(!isFlipped)}
                    >
                      Back
                    </div>
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
                    <div
                      className="w-20 h-10 bg-[rgba(0,0,0,0.2)] text-white flex justify-center items-center
                             font-bold hover:bg-[rgba(225,225,225,0.2)]  transition duration-300 cursor-pointer border-1"
                      onClick={() => setIsFlipped(!isFlipped)}
                    >
                      Submit
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
