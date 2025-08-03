import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, getUserRole } from "../utils/authGuard";

const AdminRoute = ({ children }) => {
  const isAuth = isAuthenticated();
  const role = getUserRole();

  return isAuth && role === "Admin" ? children : <Navigate to="/login" />;
};

export default AdminRoute;
