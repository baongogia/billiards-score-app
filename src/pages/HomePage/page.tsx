/* eslint-disable @typescript-eslint/no-explicit-any */
import "./index.scss";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { useGame } from "../../context/GameContext";
import { findUser } from "../../services/auth/authService";
import { useCallback } from "react";
import { RiLogoutBoxFill } from "react-icons/ri";

const HomePage = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const id = auth?.user?._id;
  const { setGameState } = useGame();
  const [isGameStateSet, setIsGameStateSet] = useState(false);
  const [allUserData, setAllUserData] = useState<any>(null);
  // Get user data
  const fetchUserData = useCallback(async () => {
    try {
      if (!auth?.user?._id) {
        throw new Error("User ID is undefined");
      }
      const res = await findUser(auth.user._id);
      const allUserData = res.data.data;
      setAllUserData(allUserData);
    } catch (error: any) {
      toast.error(error);
    }
  }, [auth]);

  // Fetch user data when component mounts
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Kiểm tra xem người dùng đã đăng nhập chưa
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, []);

  // Kiểm tra xem người dùng đã tham gia phòng chưa
  useEffect(() => {
    const tableId = localStorage.getItem("tableId");
    if (tableId) {
      navigate(`/WaitingPage/${tableId}`);
    }
  }, [navigate]);

  // Xử lý khi người dùng đăng nhập
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userString = params.get("user");
    const token = params.get("token");

    if (userString && token) {
      try {
        const decodedUser = JSON.parse(decodeURIComponent(userString));
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(decodedUser));
        auth?.login(token, decodedUser);
        window.history.replaceState({}, document.title, location.pathname);
      } catch (error) {
        console.error("Error decoding user:", error);
      }
    }
  }, [auth, navigate]);

  // Set game state when user is authenticated
  useEffect(() => {
    if (auth?.user && !isGameStateSet && allUserData) {
      setGameState({
        playerName: allUserData?.name,
      });
      setIsGameStateSet(true);
    }
  }, [auth?.user, isGameStateSet, setGameState, allUserData]);
  // Handle start game

  return (
    <div className="w-[100vw] h-[100vh] bg-[#2c3e50]">
      <div className="main-body text-white">
        {/* Header */}
        <header className="block">
          <ul className="header-menu horizontal-list">
            <li>
              <a className="header-menu-tab" href="#1">
                <span className="icon entypo-cog scnd-font-color"></span>
                Settings
              </a>
            </li>
            <li>
              <a className="header-menu-tab" href={`/MemberProfile/${id}`}>
                <span className="icon fontawesome-user scnd-font-color"></span>
                Account
              </a>
            </li>
            <li className="opacity-0 md:opacity-100">
              <a className="header-menu-tab" href="#3">
                <span className="icon fontawesome-envelope scnd-font-color"></span>
                Messages
              </a>
              <a className="header-menu-number" href="#4">
                5
              </a>
            </li>
            <li className="hidden md:block">
              <a className="header-menu-tab" href="#5">
                <span className="icon fontawesome-star-empty scnd-font-color"></span>
                Favorites
              </a>
            </li>
          </ul>
          <div className="profile-menu">
            <p>
              {auth?.user?.name || auth?.user?.email}
              <a href="#26">
                <span className="entypo-down-open scnd-font-color"></span>
              </a>
            </p>
            <div
              onClick={() => {
                navigate(`/MemberProfile/${id}`);
              }}
              className="profile-picture small-profile-picture cursor-pointer bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${allUserData?.avatar ||
                  "https://images.pexels.com/photos/5986316/pexels-photo-5986316.jpeg?auto=compress&cs=tinysrgb&w=800"
                  })`,
              }}
            ></div>
          </div>
        </header>
        {/* Content */}
        <div className="main-container md:flex">
          {/* Setting & chart */}
          <div className="left-container w-[100vw] md:w-[30vw] ml-2">
            <div className="menu-box mb-5 hidden md:block">
              <h2 className="titular">MENU BOX</h2>
              <ul className="menu-box-menu">
                <li>
                  <a className="menu-box-tab" href="#6">
                    <span className="icon fontawesome-envelope scnd-font-color"></span>
                    Messages<div className="menu-box-number">24</div>
                  </a>
                </li>
                <li>
                  <a className="menu-box-tab" href="#8">
                    <span className="icon entypo-paper-plane scnd-font-color"></span>
                    Invites<div className="menu-box-number">3</div>
                  </a>
                </li>
                <li>
                  <a className="menu-box-tab" href="#10">
                    <span className="icon entypo-calendar scnd-font-color"></span>
                    Events<div className="menu-box-number">5</div>
                  </a>
                </li>
                <li>
                  <a className="menu-box-tab" href={`/MemberProfile/${id}`}>
                    <span className="icon entypo-cog scnd-font-color"></span>
                    Account Settings
                  </a>
                </li>
                <li onClick={() => auth?.logout(navigate)}>
                  <div className="menu-box-tab scnd-font-color ml-4.5 cursor-pointer">
                    <div className="flex items-center gap-5">
                      <RiLogoutBoxFill size={25} />
                      <>Log out</>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
            {/* Donut chart */}
            <div className="donut-chart-block  hidden md:block">
              <h2 className="titular">GAME STATS</h2>
              <div className="donut-chart">
                <div id="porcion1" className="recorte">
                  <div className="quesito ios" data-rel="21"></div>
                </div>
                <div id="porcion2" className="recorte">
                  <div className="quesito mac" data-rel="39"></div>
                </div>
                <div id="porcion3" className="recorte">
                  <div className="quesito win" data-rel="31"></div>
                </div>
                <div id="porcionFin" className="recorte">
                  <div className="quesito linux" data-rel="9"></div>
                </div>
                <p className="center-date">
                  JUNE
                  <br />
                  <span className="scnd-font-color">2013</span>
                </p>
              </div>
              <ul className="os-percentages horizontal-list">
                <li>
                  <p className="ios os scnd-font-color">Win</p>
                  <p className="os-percentage">
                    21<sup>%</sup>
                  </p>
                </li>
                <li>
                  <p className="mac os scnd-font-color">Lose</p>
                  <p className="os-percentage">
                    48<sup>%</sup>
                  </p>
                </li>
                <li>
                  <p className="linux os scnd-font-color">Draw</p>
                  <p className="os-percentage">
                    9<sup>%</sup>
                  </p>
                </li>
                <li>
                  <p className="win os scnd-font-color">Win Rate</p>
                  <p className="os-percentage">
                    32<sup>%</sup>
                  </p>
                </li>
              </ul>
            </div>
            {/* Line chart */}
            <div className="line-chart-block  clear hidden md:block">
              <div className="line-chart">
                <div className="grafico">
                  <ul className="eje-y">
                    <li data-ejey="30"></li>
                    <li data-ejey="20"></li>
                    <li data-ejey="10"></li>
                    <li data-ejey="0"></li>
                  </ul>
                  <ul className="eje-x">
                    <li>Apr</li>
                    <li>May</li>
                    <li>Jun</li>
                  </ul>
                  <span data-valor="25">
                    <span data-valor="8">
                      <span data-valor="13">
                        <span data-valor="5">
                          <span data-valor="23">
                            <span data-valor="12">
                              <span data-valor="15"></span>
                            </span>
                          </span>
                        </span>
                      </span>
                    </span>
                  </span>
                </div>
              </div>
              <ul className="time-lenght horizontal-list">
                <li>
                  <a className="time-lenght-btn" href="#14">
                    Week
                  </a>
                </li>
                <li>
                  <a className="time-lenght-btn" href="#15">
                    Month
                  </a>
                </li>
                <li>
                  <a className="time-lenght-btn" href="#16">
                    Year
                  </a>
                </li>
              </ul>
              <ul className="month-data clear">
                <li>
                  <p>
                    APR<span className="scnd-font-color"> 2013</span>
                  </p>
                  <p>
                    <span className="entypo-plus increment"> </span>21
                    <sup>%</sup>
                  </p>
                </li>
                <li>
                  <p>
                    MAY<span className="scnd-font-color"> 2013</span>
                  </p>
                  <p>
                    <span className="entypo-plus increment"> </span>48
                    <sup>%</sup>
                  </p>
                </li>
                <li>
                  <p>
                    JUN<span className="scnd-font-color"> 2013</span>
                  </p>
                  <p>
                    <span className="entypo-plus increment"> </span>35
                    <sup>%</sup>
                  </p>
                </li>
              </ul>
            </div>
          </div>
          {/* Player action */}
          <div className="middle-container block w-[100vw] md:w-[70vw]">
            <div
              className="profile flex items-center justify-center p-2 gap-2 w-full"
            >
              Looks like you haven't joined any room yet. Scan the QR code on the table to start the fun.
              {/*  */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
