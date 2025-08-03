// src/utils/AdminRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, getUserRole } from "./authGuard";

const AdminRoute = ({ children }) => {
  const isAuth = isAuthenticated();
  const role = getUserRole();

  if (!isAuth || role !== "Admin") {
    return <Navigate to="/login" />;
  }

  return children;
};

export default AdminRoute;
