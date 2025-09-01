import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@Contexts/AuthContext'; 

export default function RoleRoute({ allowed }) {
  const { user } = useAuth(); 
  if (!user) return <Navigate to="/login/" replace />;
  if (!allowed.includes(user.role)) return <Navigate to="/courses" replace />;
  return <Outlet />;
}