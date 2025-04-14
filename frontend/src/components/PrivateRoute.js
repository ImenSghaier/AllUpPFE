import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  // Vérifie si un token est stocké dans le localStorage
  const token = localStorage.getItem("token");

  return token ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;
