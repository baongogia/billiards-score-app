import "./index.css";
import HomePage from "./pages/HomePage/page";
import LandingPage from "./pages/LandingPage/page";
import Login from "./pages/LoginPage/page";
import WaitingPage from "./pages/WaitingPage/page";
import GamePlay from "./pages/GamePlay/page";
import HistoryMatch from "./pages/HistoryMatch/page";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AdminPage from "./pages/AdminPage/AdminPage";
import UsersPage from "./pages/AdminPage/UserPage/UsersPage";
import UserProfile from "./components/Admin/UserTable/UserProfile";
import UserCreate from "./components/Admin/UserTable/register";
import StoresPage from "./pages/AdminPage/StoresPage/StoresPage";
import CreateStore from "./components/Admin/StoreTable/CreateStore";
import MatchesPage from "./pages/AdminPage/StoresPage/MatchesPage/MatchesPage";
import TablesPage from "./pages/AdminPage/TablesPage/TablesPage";

import ManagerPage from "./pages/ManagerPage/ManagerPage";
import TablePage from "./pages/ManagerPage/TablePage/TablePage";
import MatchPage from "./pages/ManagerPage/MatchesPage/MatchesPage";
import Unauthorized from "./pages/Unauthorize/page";
import { ProtectedRoute } from "./components/ProtectRoute/ProtectedRoute";
import MemberProfile from "./pages/MemberProfile/page";

const router = createBrowserRouter([
  { path: "/:tableId", element: <LandingPage /> },
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <Login /> },
  { path: "/WaitingPage/:tableId/:matchId?", element: <WaitingPage /> },
  { path: "/WaitingPage", element: <WaitingPage /> },
  {
    path: "/HomePage/*",
    element: <HomePage />,
  },
  { path: "/GamePlay", element: <GamePlay /> },
  { path: "/MemberProfile/:id", element: <MemberProfile /> },
  { path: "/HistoryMatch/:userId", element: <HistoryMatch />},
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminPage />
      </ProtectedRoute>
    ),
  },
  { path: "/admin/users", element: <UsersPage /> },
  { path: "/admin/user/:id", element: <UserProfile /> },
  { path: "/admin/register", element: <UserCreate /> },
  { path: "/admin/stores", element: <StoresPage /> },
  { path: "/admin/create-store", element: <CreateStore /> },
  { path: "/admin/matches", element: <MatchesPage /> },
  { path: "/admin/tables", element: <TablesPage /> },

  {
    path: "/manager",
    element: (
      <ProtectedRoute allowedRoles={["manager"]}>
        <ManagerPage />
      </ProtectedRoute>
    ),
  },
  { path: "/manager/tables", element: <TablePage /> },
  { path: "/manager/matches", element: <MatchPage /> },
  { path: "*", element: <Unauthorized /> },
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
