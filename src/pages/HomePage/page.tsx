import "./index.scss";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
const HomePage = () => {
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  console.log(auth);

  if (!auth?.token) {
    navigate("/");
  } else {
    console.log("User authenticated");
  }

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
        toast.success(`Welcome ${decodedUser.name}!`);
      } catch (error) {
        console.error("Error decoding user:", error);
      }
    }
  }, [auth, navigate]);

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
              <a className="header-menu-tab" href="#2">
                <span className="icon fontawesome-user scnd-font-color"></span>
                Account
              </a>
            </li>
            <li>
              <a className="header-menu-tab" href="#3">
                <span className="icon fontawesome-envelope scnd-font-color"></span>
                Messages
              </a>
              <a className="header-menu-number" href="#4">
                5
              </a>
            </li>
            <li>
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
              onClick={auth?.logout}
              className="profile-picture small-profile-picture cursor-pointer"
            >
              <img
                width="40px"
                src="https://images.pexels.com/photos/6254191/pexels-photo-6254191.jpeg?auto=compress&cs=tinysrgb&w=800"
              />
            </div>
          </div>
        </header>
        <div className="main-container flex">
          {/* Setting & chart */}
          <div className="left-container w-[30vw] ml-2">
            <div className="menu-box block">
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
                  <a className="menu-box-tab" href="#12">
                    <span className="icon entypo-cog scnd-font-color"></span>
                    Account Settings
                  </a>
                </li>
                <li>
                  <a className="menu-box-tab" href="#13">
                    <span className="icon entypo-chart-line scnd-font-color"></span>
                    Statistics
                  </a>
                </li>
              </ul>
            </div>
            <div className="donut-chart-block block">
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
                  <p className="win os scnd-font-color">Win AI</p>
                  <p className="os-percentage">
                    32<sup>%</sup>
                  </p>
                </li>
              </ul>
            </div>
            <div className="line-chart-block block clear">
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
          <div className="middle-container w-[70vw]">
            <div
              style={{ display: "flex" }}
              className="profile block p-2 gap-2"
            >
              <div
                style={{
                  backgroundImage: `url("https://images.pexels.com/photos/5986316/pexels-photo-5986316.jpeg?auto=compress&cs=tinysrgb&w=800")`,
                }}
                onClick={() => navigate("/WaitingPage")}
                className="h-full w-1/3 bg-[rgba(105,255,85,0.3)] backdrop-blur-2xl rounded-2xl flex justify-center items-center uppercase font-bold text-white text-2xl shadow-2xl cursor-pointer  bg-cover bg-center"
              >
                New Game
              </div>
              <div
                style={{
                  backgroundImage: `url("https://images.pexels.com/photos/6503522/pexels-photo-6503522.jpeg?auto=compress&cs=tinysrgb&w=800")`,
                }}
                className="h-full w-1/3 bg-[rgba(255,209,57,0.3)] backdrop-blur-2xl rounded-2xl flex justify-center items-center uppercase font-bold text-white cursor-pointer bg-cover bg-center text-2xl shadow-2xl "
              >
                Create game
              </div>
              <div
                style={{
                  backgroundImage: `url("https://images.pexels.com/photos/7403806/pexels-photo-7403806.jpeg?auto=compress&cs=tinysrgb&w=800")`,
                }}
                className="h-full w-1/3 bg-[rgba(85,255,229,0.3)] backdrop-blur-2xl rounded-2xl flex justify-center items-center uppercase font-bold text-white cursor-pointer bg-cover bg-center text-2xl shadow-2xl"
              >
                Play With AI
              </div>
              {/*  */}
            </div>
            <div className="calendar-day mb-4">
              <div className="arrow-btn-container">
                <a className="arrow-btn left" href="#200">
                  <span className="icon fontawesome-angle-left"></span>
                </a>
                <h2 className="titular">WEDNESDAY</h2>
                <a className="arrow-btn right" href="#201">
                  <span className="icon fontawesome-angle-right"></span>
                </a>
              </div>
              <p className="the-day">26</p>
              <a className="add-event button" href="#27">
                ADD EVENT
              </a>
            </div>
            <div className="calendar-month block">
              <div className="arrow-btn-container">
                <a className="arrow-btn left" href="#202">
                  <span className="icon fontawesome-angle-left"></span>
                </a>
                <h2 className="titular">APRIL 2013</h2>
                <a className="arrow-btn right" href="#203">
                  <span className="icon fontawesome-angle-right"></span>
                </a>
              </div>
              <table className="calendar">
                <thead className="days-week">
                  <tr>
                    <th>S</th>
                    <th>M</th>
                    <th>T</th>
                    <th>W</th>
                    <th>R</th>
                    <th>F</th>
                    <th>S</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td>
                      <a className="scnd-font-color" href="#100">
                        1
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <a className="scnd-font-color" href="#101">
                        2
                      </a>
                    </td>
                    <td>
                      <a className="scnd-font-color" href="#102">
                        3
                      </a>
                    </td>
                    <td>
                      <a className="scnd-font-color" href="#103">
                        4
                      </a>
                    </td>
                    <td>
                      <a className="scnd-font-color" href="#104">
                        5
                      </a>
                    </td>
                    <td>
                      <a className="scnd-font-color" href="#105">
                        6
                      </a>
                    </td>
                    <td>
                      <a className="scnd-font-color" href="#106">
                        7
                      </a>
                    </td>
                    <td>
                      <a className="scnd-font-color" href="#107">
                        8
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <a className="scnd-font-color" href="#108">
                        9
                      </a>
                    </td>
                    <td>
                      <a className="scnd-font-color" href="#109">
                        10
                      </a>
                    </td>
                    <td>
                      <a className="scnd-font-color" href="#110">
                        11
                      </a>
                    </td>
                    <td>
                      <a className="scnd-font-color" href="#111">
                        12
                      </a>
                    </td>
                    <td>
                      <a className="scnd-font-color" href="#112">
                        13
                      </a>
                    </td>
                    <td>
                      <a className="scnd-font-color" href="#113">
                        14
                      </a>
                    </td>
                    <td>
                      <a className="scnd-font-color" href="#114">
                        15
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <a className="scnd-font-color" href="#115">
                        16
                      </a>
                    </td>
                    <td>
                      <a className="scnd-font-color" href="#116">
                        17
                      </a>
                    </td>
                    <td>
                      <a className="scnd-font-color" href="#117">
                        18
                      </a>
                    </td>
                    <td>
                      <a className="scnd-font-color" href="#118">
                        19
                      </a>
                    </td>
                    <td>
                      <a className="scnd-font-color" href="#119">
                        20
                      </a>
                    </td>
                    <td>
                      <a className="scnd-font-color" href="#120">
                        21
                      </a>
                    </td>
                    <td>
                      <a className="scnd-font-color" href="#121">
                        22
                      </a>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <a className="scnd-font-color" href="#122">
                        23
                      </a>
                    </td>
                    <td>
                      <a className="scnd-font-color" href="#123">
                        24
                      </a>
                    </td>
                    <td>
                      <a className="scnd-font-color" href="#124">
                        25
                      </a>
                    </td>
                    <td>
                      <a className="today" href="#125">
                        26
                      </a>
                    </td>
                    <td>
                      <a href="#126">27</a>
                    </td>
                    <td>
                      <a href="#127">28</a>
                    </td>
                    <td>
                      <a href="#128">29</a>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <a href="#129">30</a>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
