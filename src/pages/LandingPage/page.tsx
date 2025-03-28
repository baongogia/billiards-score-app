import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./index.scss";
import "./animation.ts";
import { start } from "./animation.ts";
import { GuestCard } from "./GuestCard.tsx";


export default function LandingPage() {
  const navigate = useNavigate();
  const [overLayer, setOverLayer] = useState(false);
  const { tableId } = useParams();
  if (tableId) {
    localStorage.setItem("tableId", tableId);
  }

  // Prevent scrolling
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  // Start animation
  const animationStarted = useRef(false);
  // Start animation when the page is loaded
  useEffect(() => {
    if (!animationStarted.current) {
      const demoElement = document.getElementById("demo");
      if (demoElement) {
        console.log("Found #demo, starting animation...");
        start();
        animationStarted.current = true;
      }
    }
  }, []);

  return (
    <div className="">
      <div className="indicator"></div>
      <div id="demo"></div>
      {/* Demo card */}
      <div
        className="details text-white opacity-0 md:opacity-100"
        id="details-even"
      >
        <div className="place-box">
          <div className="text">Billiards</div>
        </div>
        <div className="title-box-1">
          <div className="title-1">BIDA</div>
        </div>
        <div className="title-box-2">
          <div className="title-2">CHINESE EIGHT</div>
        </div>
      </div>
      <div
        className="details text-white opacity-0 md:opacity-100"
        id="details-odd"
      >
        <div className="place-box">
          <div className="text">Billiards</div>
        </div>

        <div className="title-box-1">
          <div className="title-1">BIDA</div>
        </div>

        <div className="title-box-2">
          <div className="title-2">RUSSIAN</div>
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
            className="w-full h-full bg-black text-white flex justify-center items-center
                      font-bold hover:bg-white hover:text-black transition duration-300 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            LOGIN
          </div>
        </div>
        <div className="w-50 h-14 border-white border-1">
          <div
            className="w-full h-full bg-black text-white flex flex-col justify-center items-center uppercase font-bold
          hover:bg-white hover:text-black transition duration-300 cursor-pointer"
            onClick={() => setOverLayer(true)}
          >
            Billiard Mobile App
            <p>(Coming soon)</p>
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
        {tableId && <GuestCard id={tableId} />}
      </div>
    </div>
  );
}
