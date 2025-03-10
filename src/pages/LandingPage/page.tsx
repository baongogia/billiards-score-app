import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import GuestCard from "./GuestCard.tsx";
import "./index.scss";
import "./animation.ts";

export default function LandingPage() {
  // Prevent scrolling
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  // Auto reload page
  useEffect(() => {
    const handlePopState = () => {
      window.location.reload();
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);
  // Navigate to login page
  const navigate = useNavigate();
  const [overLayer, setOverLayer] = useState(false);
  // Handle login
  const handleLogin = () => {
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };
  return (
    <>
      <div className="indicator"></div>
      <div id="demo"></div>
      {/* Demo card */}
      <div className="details text-white" id="details-even">
        <div className="place-box">
          <div className="text">Billiards</div>
        </div>
        <div className="title-box-1">
          <div className="title-1">BIDA</div>
        </div>
        <div className="title-box-2">
          <div className="title-2">CHINESE EIGHT</div>
        </div>
        <div className="desc">
          Chinese Eight-ball blends elements of snooker and pool, growing in
          popularity for its dynamic and challenging gameplay.
        </div>
      </div>
      <div className="details text-white" id="details-odd">
        <div className="place-box">
          <div className="text">Billiards</div>
        </div>

        <div className="title-box-1">
          <div className="title-1">BIDA</div>
        </div>

        <div className="title-box-2">
          <div className="title-2">RUSSIAN</div>
        </div>

        <div className="desc">
          Russian billiards, or Pyramid, features larger balls and tighter
          pockets, demanding extreme accuracy and skill.
        </div>
        <div className="cta"></div>
      </div>
      {/* Pagination & Cover */}
      <div className="pagination" id="pagination"></div>
      <div className="cover"></div>
      {/* Button */}
      <div className="absolute w-full h-full z-50 top-[69vh] left-[3.8vw] flex space-x-4">
        <div className="w-34 h-14 border-white border-1">
          <div
            className="w-full h-full bg-[rgba(0,0,0,0.2)] text-white flex justify-center items-center
                             font-bold hover:bg-white hover:text-black transition duration-300 cursor-pointer"
            onClick={handleLogin}
          >
            LOGIN
          </div>
        </div>
        <div className="w-50 h-14 border-white border-1">
          <div
            className="w-full h-full bg-[rgba(0,0,0,0.2)] text-white flex justify-center items-center uppercase font-bold
          hover:bg-white hover:text-black transition duration-300 cursor-pointer"
            onClick={() => setOverLayer(true)}
          >
            play as guest
          </div>
        </div>
      </div>
      {/* Overlay */}
      <div
        className={`overlay absolute w-full h-full z-50  flex justify-center items-center transition-all duration-300 ${
          overLayer
            ? "bg-[rgba(0,0,0,0.6)] pointer-events-auto"
            : "bg-[rgba(0,0,0,0)] pointer-events-none opacity-0"
        }`}
      >
        <GuestCard />
      </div>
    </>
  );
}
