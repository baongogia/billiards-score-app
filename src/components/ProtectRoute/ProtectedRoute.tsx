import { JSX } from "react";
import { Navigate } from "react-router-dom";

export function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: JSX.Element;
  allowedRoles: string[];
}) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || !role || !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
}
