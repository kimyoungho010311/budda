import React from "react";
import { Navigate } from "react-router";
import { isAuthenticated } from "../util/authUtil";

const ProtectedRoute = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
