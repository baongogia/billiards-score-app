import "./index.scss";
import Loading from "../../components/Loading/Loading";
import PlayerCard from "./PlayerCard";
import BidaTable from "../../components/BidaTable/page";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function WaitingPage() {
  // Ngăn cuộn trang
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const navigate = useNavigate();

  // Trạng thái thông tin người chơi
  const [partnerName, setPartnerName] = useState("");
  const [partnerReady, setPartnerReady] = useState(false);

  return (
    <div className="relative w-[100vw] bg-green-950 h-[100vh] flex justify-center items-center">
      {/* Background */}
      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-full h-full flex justify-center items-center">
        <BidaTable />
      </div>
      <div className="absolute scale-150 flex flex-col">
        {/* Loading */}
        <Loading />
        {/* Input để nhập thông tin partner - Guest */}
        {!partnerReady && (
          <div
            style={{ backdropFilter: "blur(3px)" }}
            className="absolute -top-10 w-64 h-80 p-2 bg-[rgba(255,255,255,0.4)] shadow  rounded-2xl text-white my-4"
          >
            <div className="w-full flex justify-center items-center">
              <img
                src="https://aobidathietke.com/wp-content/uploads/2023/04/Mau-Logo-Bida-Thiet-Ke-Dep-Danh-Cho-doi-Cau-Lac-Bo-Club-Quan-Billiards-2-400x400.png"
                alt=""
                className="h-43 scale-130 w-40"
              />
            </div>
            <input
              type="text"
              placeholder="Partner's name..."
              className="w-full h-10 border-1 border-gray-300 rounded px-2
               bg-[rgba(255,255,255,0.6)] text-black outline-none mt-3.5"
              value={partnerName}
              onChange={(e) => setPartnerName(e.target.value)}
            />
            <button
              onClick={() => setPartnerReady(true)}
              className="w-full h-10 bg-[rgba(255,255,255,0.4)] border text-white hover:bg-[rgba(255,255,255,0.6)] cursor-pointer font-bold rounded mt-2  transition duration-300"
              disabled={!partnerName.trim()}
            >
              Confirm
            </button>
          </div>
        )}
        {/* Button để bắt đầu game - Guest */}
        {partnerReady && (
          <div className="text-center text-white w-full h-10 flex gap-2">
            <div
              onClick={() => navigate("/GamePlay")}
              className="w-full border-1 flex justify-center items-center uppercase font-bold hover:bg-green-600 transition duration-300 cursor-pointer"
            >
              Start Game
            </div>
          </div>
        )}
      </div>
      {/* Player Cards */}
      <div className="relative grid grid-cols-2 w-screen h-screen pointer-events-none">
        {/* Người chơi chính */}
        <PlayerCard className="player-1" name="Doraemon" />
        {/* Partner chỉ xuất hiện khi đã nhập xong thông tin */}
        {partnerReady && <PlayerCard className="player-2" name={partnerName} />}
      </div>

      {/* CSS để đặt vị trí thẻ người chơi */}
      <style>{`
        .player-1 { position: absolute; bottom: 25px; left: 25px; }
        .player-2 { position: absolute; bottom: 25px; right: 25px; }
      `}</style>
    </div>
  );
}
