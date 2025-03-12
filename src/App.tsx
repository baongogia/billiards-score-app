import "./index.css";
import HomePage from "./pages/HomePage/page";
import LandingPage from "./pages/LandingPage/page";
import Login from "./pages/LoginPage/page";
import WaitingPage from "./pages/WaitingPage/page";
import GamePlay from "./pages/GamePlay/page";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserProfile from "./pages/UserProfile/page";

import AdminPage from "./pages/AdminPage/AdminPage";
import UsersPage from "./pages/AdminPage/UserPage/UsersPage";
import MembersPage from "./pages/AdminPage/MemberPage/MembersPage";
import StoresPage from "./pages/AdminPage/StoresPage/StoresPage";
import CreateStore from "./components/Admin/StoreTable/CreateStore";

import ManagerPage from "./pages/ManagerPage/ManagerPage";
import TablesPage from "./pages/ManagerPage/TablePage/TablePage";
import MatchesPage from "./pages/ManagerPage/MatchesPage/MatchesPage";
import { ProtectedRoute } from "./components/ProtectRoute/ProtectedRoute";
import Unauthorized from "./pages/Unauthorize/page";

const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/login", element: <Login /> },
  { path: "/WaitingPage/:tableId", element: <WaitingPage /> },
  {
    path: "/HomePage",
    element: (
      <ProtectedRoute allowedRoles={["user"]}>
        <HomePage />
      </ProtectedRoute>
    ),
  },
  { path: "/GamePlay", element: <GamePlay /> },

  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminPage />
      </ProtectedRoute>
    ),
  },
  { path: "/admin/users", element: <UsersPage /> },
  { path: "/admin/members", element: <MembersPage /> },
  { path: "/admin/stores", element: <StoresPage /> },
  { path: "/admin/create-store", element: <CreateStore /> },
  { path: "/UserProfile", element: <UserProfile /> },

  {
    path: "/manager",
    element: (
      <ProtectedRoute allowedRoles={["manager"]}>
        <ManagerPage />
      </ProtectedRoute>
    ),
  },
  { path: "manager/tables", element: <TablesPage /> },
  { path: "/manager/matches", element: <MatchesPage /> },
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
