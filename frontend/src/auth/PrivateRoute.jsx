import { Outlet, Navigate } from "react-router-dom";
import { isAuthenticated } from "./helpers";

const PrivateRoute = () => {
  // Redirect admin users to admin dashboard
  if (isAuthenticated() && isAuthenticated().user.role === 1) {
    return <Navigate to="/admin/dashboard" />;
  }
  return isAuthenticated() ? <Outlet /> : <Navigate to="/signin" />;
};

export default PrivateRoute;
