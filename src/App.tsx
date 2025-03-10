import "./index.css";
import HomePage from "./pages/HomePage/page";
import LandingPage from "./pages/LandingPage/page";
import Login from "./pages/LoginPage/page";
import WaitingPage from "./pages/WaitingPage/page";
import GamePlay from "./pages/GamePlay/page";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <Login /> },
  { path: "/WaitingPage", element: <WaitingPage /> },
  { path: "/HomePage", element: <HomePage /> },
  { path: "/GamePlay", element: <GamePlay /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
