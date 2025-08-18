import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@Contexts/AuthContext'; // подстрой под свой путь

export default function RoleRoute({ allowed }) {
  const { user } = useAuth(); // ожидается { role: 'TEACHER' | 'STUDENT', ... }
  if (!user) return <Navigate to="/login/" replace />;
  if (!allowed.includes(user.role)) return <Navigate to="/courses" replace />;
  return <Outlet />;
}