import { Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage/page";
import Login from "./pages/LoginPage/Login";
import "./index.css";
import WaitingPage from "./pages/WaitingPage/page";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/WaitingPage" element={<WaitingPage />}></Route>
      </Routes>
    </>
  );
}

export default App;
