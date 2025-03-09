// import React from "react";
import "./index.scss";
import Loading from "../../components/Loading/Loading";
import PlayerCard from "./PlayerCard";
import BidaTable from "../../components/BidaTable/page";
import { useEffect } from "react";
export default function WaitingPage() {
  // Prevent scrolling
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  return (
    <div className="relative w-[100vw] h-[100vh] bg-gray-600 flex justify-center items-center">
      {/* Background */}
      <div className="absolute top-14">
        <BidaTable />
      </div>
      <div className="absolute scale-150 flex flex-col">
        {/* Loading */}
        <Loading />
        {/* Button */}
        <div className="text-center text-white w-full h-10 flex gap-2">
          <div className="w-1/2 border-1 flex justify-center items-center uppercase font-bold hover:bg-green-600 transition duration-300 cursor-pointer">
            Play
          </div>
          <div className="w-1/2 border-1 flex justify-center items-center uppercase font-bold hover:bg-blue-600 transition duration-300 cursor-pointer">
            Settings
          </div>
        </div>
      </div>
      {/* Player */}
      <div className="relative w-screen h-screen pointer-events-none">
        {Array.from({ length: 4 }).map((_, index) => (
          <PlayerCard key={index} className={`player-${index + 1}`} />
        ))}
      </div>
      <style>{`
        .player-1 { position: absolute; top: 25px; left: 25px; }
        .player-2 { position: absolute; top: 25px; right: 25px; }
        .player-3 { position: absolute; bottom: 25px; left: 25px; }
        .player-4 { position: absolute; bottom: 25px; right: 25px; }
        `}</style>
    </div>
  );
}
