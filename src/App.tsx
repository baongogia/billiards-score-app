import "./index.css";
import HomePage from "./pages/HomePage/page";
import LandingPage from "./pages/LandingPage/page";
import Login from "./pages/LoginPage/page";
import WaitingPage from "./pages/WaitingPage/page";
import GamePlay from "./pages/GamePlay/page";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <Login /> },
  { path: "/WaitingPage", element: <WaitingPage /> },
  { path: "/HomePage", element: <HomePage /> },
  { path: "/GamePlay", element: <GamePlay /> },
]);

function App() {
  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
