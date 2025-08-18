import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";

const PrivateRoute = () => {
  const { user, loading } = useAuth();

  if (loading) return <div>Загрузка...</div>; 

  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
