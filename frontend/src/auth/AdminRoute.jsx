import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "./helpers";

export const AdminRoute = () => {
  return isAuthenticated() && isAuthenticated().user.role === 1 ? (
    <Outlet />
  ) : (
    <Navigate to={"/"} />
  );
};
export default AdminRoute;
